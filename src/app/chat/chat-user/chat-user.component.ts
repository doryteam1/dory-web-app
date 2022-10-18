import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { UsuarioService } from 'src/app/services/usuario.service';
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

  constructor(
    private chatService: ChatService,
    private userService: UsuarioService,
    private ref:ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getAuthUser();
    this.chatService
      .getMessage()
      .subscribe((data: { de: number;  mensaje: string }) => {
        console.log(data)
        this.roomsArray = this.chatService.getStorage();
        const roomIndex = this.roomsArray.findIndex(
          (storage: any) => storage.roomId === data.de
        );
        this.messageArray = [];
        if(roomIndex > -1){
          console.log("existe la sala")
          console.log(this.roomsArray[roomIndex])
          this.roomsArray[roomIndex].chats.push({
            fromUserId: data.de,
            message: data.mensaje
          });
        }else{
          console.log("nueva sala")
          const updateStorage = {
            roomId: data.de,
            chats: [
              {
                fromUserId: data.de,
                message: data.mensaje,
              },
            ],
          };
          this.roomsArray.push(updateStorage);
        }
        this.chatService.setStorage(this.roomsArray);
        /*Carga los mensajes del la sala del usuario seleccionado*/
        this.loadRoomMessages();
        this.scrollToBottom()
      });

      this.chatService
      .getConectedUsers()
      .subscribe((data:any[]) => {
          this.userList = data.map(
            (element:any)=>{
              return {
                id:element.id,
                name: element.nombre_completo,
                phone: element.celular,
                image: element.foto,
                estatus: true,
              }
            }
          )
          this.userList = this.userList.filter(
            (element:any)=>{
              return element.id !== this.userService.getAuthUser().sub
            }
          )
          console.log(this.userList)
      });
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
    const roomIndex = this.roomsArray.findIndex(
      (storage: any) => storage.roomId === this.selectedUser.id
    );

    if (roomIndex > -1) {
      this.messageArray = this.roomsArray[roomIndex].chats;
    }
    this.scrollToBottom()  
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
}
