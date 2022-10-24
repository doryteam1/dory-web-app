import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import * as dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
@Component({
  selector: 'app-chat-user',
  templateUrl: './chat-user.component.html',
  styleUrls: ['./chat-user.component.scss'],
})
export class ChatUserComponent implements OnInit {
  messageText!: string;
  messageArray: { fromUserId:number, message: string }[] = [];
  private roomsArray: {
      roomId: number,
      chats: {
        fromUserId: number,
        message: string,
      }[]
  }[] = [];
  showScreen = false;
  phone!: string;
  selectedUser: any;
  Onlist: boolean = true;
  
  public userList:any[] = [
  ];
  currentUser: any; 
  chatOpen: boolean = false;
  connectedUsersObtained:boolean = false;
  connectedUsers: { id: any; name: any; phone: any; image: any; status: boolean; }[] = [];
  syncConnected:boolean = false;
  usersObtained:boolean = false;
  filteredUserList: any[] = [];
  textSearch:string='';
  recents: any[] = [];
  constructor(
    private chatService: ChatService,
    private userService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getAuthUser();
    this.userService.getTodosUsuarioAll().subscribe(
      (response)=>{
        this.userList = response.data.map(
          (element:any)=>{
            return {
              id:element.id,
              name: element.nombre_completo,
              phone: element.celular,
              image: element.foto,
              status: false,
            }
          }
        )
        this.userList = this.userList.filter(
          (element:any)=>{
            return element.id !== this.userService.getAuthUser().sub
          }
        )
        this.usersObtained = true;
        if(!this.syncConnected && this.connectedUsersObtained){//llegaron los usuarios conectados y no estan sincronizados
          this.syncConnectedUsers();
        }
      }
    )
    this.chatService
      .getMessage()
      .subscribe((data: { de: number;  mensaje: string, metadata:any }) => {
        console.log(data)
        //TODO: hacer algo con el mensaje de confirmacion
        this.roomsArray = this.chatService.getStorage();
        const roomIndex = this.roomsArray.findIndex(
          (storage: any) => storage.roomId === data.de
        );
        this.messageArray = [];
        if(roomIndex > -1){
          this.roomsArray[roomIndex].chats.push({
            fromUserId: data.de,
            message: data.mensaje
          });
          console.log("seteando ultimo mensaje")
        }else{
          const updateStorage = {
            roomId: data.de,
            chats: [
              {
                fromUserId: data.de,
                message: data.mensaje,
              },
            ],
            ultimo_mensaje:data.metadata.message.contenido,
            fecha_ultimo_mensaje:data.metadata.message.fecha_creacion
          };
          this.roomsArray.push(updateStorage);
        }
        this.chatService.setStorage(this.roomsArray);
        this.setUltimo(data)
        /*Carga los mensajes del la sala del usuario seleccionado*/
        this.loadRoomMessages();
        this.scrollToBottom()
      });

      this.chatService
      .getConectedUsers()
      .subscribe((data:any[]) => {
          if(this.connectedUsersObtained){
            return;
          }
          this.connectedUsers = data.map(
            (element:any)=>{
              return {
                id:element.id,
                name: element.nombre_completo,
                phone: element.celular,
                image: element.foto,
                status: true,
              }
            }
          )
          this.connectedUsers = this.connectedUsers.filter(
            (element:any)=>{
              return element.id !== this.userService.getAuthUser().sub
            }
          )
          this.connectedUsersObtained = true;
          if(!this.syncConnected && this.usersObtained){//se tienen los usuarios del sistema y no estan sincronizados
            this.syncConnectedUsers();
          }
      });


      this.chatService.getConfirmMessage().subscribe(
        (data)=>{
          this.setUltimo(data)
        }
      )
      this.chatService.getLastUserConnected().subscribe(
        (userId)=>{
          let index = this.userList.findIndex(
            (user)=>{
              return user?.id == userId;
            }
          )
          if(index > -1 && this.syncConnected){
            this.userList[index].status = true;
            this.onSearch();
          }
        }
      )

      this.chatService.getLastUserDisconnected().subscribe(
        (userId)=>{
          let index = this.userList.findIndex(
            (user)=>{
              return user?.id == userId;
            }
          )
          if(index > -1  && this.syncConnected)
            this.userList[index].status = false;
            this.onSearch();
        }
      )
  }



  syncConnectedUsers(){
    this.connectedUsers.forEach(
      (element)=>{
          let index = this.userList.findIndex(
            (user)=>{
               return user?.id == element?.id; 
            }
          );
          if(index > -1)
            this.userList[index].status = true;
    })
    this.filteredUserList = this.userList.slice();
    this.syncConnected = true;
    this.orderRecentChats();
  }

  orderRecentChats(){
    this.chatService.getUltimosMensajes().subscribe(
      (response)=>{
        this.recents = response.data;
        let usersOrder:any[] = [];
        this.recents?.forEach(
          (recent)=>{
              let userId:number;
              if(recent.usuario_emisor_id == this.userService.getAuthUser().sub){
                userId = recent?.usuario_receptor_id;
              }else{
                userId = recent?.usuario_emisor_id;
              }
              let index = this.userList?.findIndex(
                (element)=>{
                  return element?.id == userId
                }
              )
             if(index > -1)
             {
              usersOrder.push(this.userList[index]);
              this.userList.splice(index,1);
             }

             let roomIndex = this.roomsArray.findIndex(
              (room)=>{
                return room.roomId == userId
              }
             )
          }
        )

        this.userList = usersOrder.concat(this.userList)
        this.filteredUserList = this.userList.slice();
      },err=>{

      }
    )
  }

  loadRoomMessages(){
    if(this.selectedUser){
      const roomIndex = this.roomsArray.findIndex(
        (storage: any) => storage.roomId === this.selectedUser.id
      );
      if(roomIndex > -1){
          this.messageArray = [];
          this.messageArray = this.roomsArray[roomIndex].chats;
      }
    }
  }
  selectUserHandler(id: any, i: any): void {
    this.Onlist = false;
    /* Verificamos si el usurio selecionado esta en la lista y retornamos sus datos */
    this.selectedUser = this.userList.find((user) => user.id === id);
    this.messageArray = [];
    this.roomsArray = this.chatService.getStorage();
    let roomIndex = this.roomsArray.findIndex(
      (storage: any) => storage.roomId === this.selectedUser.id
    );

    if(roomIndex == -1){
      const updateStorage = {
        roomId: this.selectedUser.id,
        chats: [
        ],
        ultimo_mensaje:'',
        fecha_ultimo_mensaje:''
      };
      this.roomsArray.push(updateStorage);
      roomIndex = this.roomsArray.length - 1;
    }
    
    this.chatService.getChatMessages(this.selectedUser.id).subscribe(
      (response:{data:any[]})=>{
        this.roomsArray[roomIndex].chats = response.data?.map(
          (message)=> { return { fromUserId: message.usuario_emisor_id, message:message.contenido} })
        this.chatService.setStorage(this.roomsArray);
        this.messageArray = this.roomsArray[roomIndex].chats;
        this.scrollToBottom();
      }
    )
    
   
    //this.join(this.currentUser.name, this.roomId);
  }

  join(username: string, roomId: string): void {
    this.chatService.joinRoom({ user: username, room: roomId });
  }

  sendMessage(): void {
    console.log("send message!")
    console.log("mensaje a enviar: ",this.messageText)
    if(!this.messageText){
      return;
    }
    console.log("send message to")
    console.log(this.selectedUser)
    this.chatService.sendMessage({
      uid: this.selectedUser.id,
      mensaje: this.messageText,
    });

    this.roomsArray = this.chatService.getStorage();
    console.log("en send message ", this.roomsArray)
    const roomIndex = this.roomsArray.findIndex(
      (storage: any) => storage.roomId === this.selectedUser.id
    );

    this.messageArray = [];

    if (roomIndex > -1) {
      this.roomsArray[roomIndex].chats.push({
        fromUserId: this.currentUser.sub,
        message: this.messageText,
      });
      this.messageArray = this.roomsArray[roomIndex].chats;
    } else {
      const updateStorage = {
        roomId: this.selectedUser.id,
        chats: [
          {
            fromUserId: this.currentUser.sub,
            message: this.messageText,
          },
        ],
        ultimo_mensaje:'',
        fecha_ultimo_mensaje:''
      };
      this.roomsArray.push(updateStorage);
      this.messageArray = this.roomsArray[this.roomsArray.length - 1].chats;
    }
    this.chatService.setStorage(this.roomsArray);
    this.messageText = ''; 
    this.scrollToBottom()  
    //this.ref.detectChanges();
  }

  scrollToBottom(): void {
    setTimeout(()=>{
      let el = document.querySelector('#chatBodyContainer');
      el!.scrollTop = el?.scrollHeight!; 
    },50)
  }

  back() {
    this.Onlist = true;
  }
  openChat() {
    this.chatOpen = true;
  }
  closeChat() {
    this.chatOpen = false;
  }

  onSearch(){
    this.filteredUserList = this.userList.filter(
      (element)=>element?.name?.toLowerCase().includes(this.textSearch.toLowerCase())
    )
  }

  getUltimo(userId:number){
    let index = this.recents.findIndex(
      (element)=>{
        return element.chat_id ==  this.userService.getAuthUser().sub + userId;
      }
    )

    if(index > -1){
      return this.recents[index];
    }else{
      return null;
    }
  }

  setUltimo(data:{de:number,mensaje:string,metadata:any}){
    let index = this.recents.findIndex(
      (element)=>{
        return element.chat_id ==  data?.metadata?.message?.usuario_emisor_id + data?.metadata?.message?.usuario_receptor_id ;
      }
    )
    if(index > -1){
      this.recents[index].contenido = data?.mensaje;
      this.recents[index].fecha_creacion = data?.metadata?.message?.fecha_creacion;
    }else{
      let newRecent = data.metadata.message;
      newRecent.chat_id = newRecent.usuario_emisor_id + newRecent.usuario_receptor_id;
      this.recents.push(newRecent);
    }

    let roomId:number;
    if(data?.metadata?.message?.usuario_emisor_id == this.userService.getAuthUser().sub){
      roomId = data?.metadata?.message?.usuario_receptor_id;
    }else{
      roomId = data?.metadata?.message?.usuario_emisor_id;
    }

    let roomIndex = this.userList.findIndex(
      (user)=>{
        return user.id == roomId;
      }
    )

    console.log("roomId ",roomId)
    if(roomIndex > -1){
      let user = this.userList[roomIndex]
      this.userList.splice(roomIndex,1);
      this.userList.splice(0,0,user);
      this.onSearch();
    }
  }

  dateFromX(date:string){
    return dayjs(date).fromNow(true)
  }
}
