import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import * as dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime';
import { Subscription } from 'rxjs';
import { UtilitiesService } from 'src/app/services/utilities.service';
dayjs.extend(relativeTime);
@Component({
  selector: 'app-chat-user',
  templateUrl: './chat-user.component.html',
  styleUrls: ['./chat-user.component.scss'],
})
export class ChatUserComponent implements OnInit, AfterViewInit {
  messageText!: string;
  messageArray: { fromUserId: number; message: string }[] = [];
  private roomsArray: {
    roomId: number;
    chats: {
      fromUserId: number;
      message: string;
    }[];
  }[] = [];
  showScreen = false;
  phone!: string;
  selectedUser: any;
  Onlist: boolean = true;

  public userList: any[] = [];
  currentUser: any;
  chatOpen: boolean = false;
  connectedUsersObtained: boolean = false;
  connectedUsers: {
    id: any;
    name: any;
    phone: any;
    image: any;
    status: boolean;
  }[] = [];
  syncConnected: boolean = false;
  usersObtained: boolean = false;
  filteredUserList: any[] = [];
  textSearch: string = '';
  recents: any[] = [];
  unreads: any[] = [];
  totalUnreads: number = 0;
  userChatRefs: any;
  borrarseart: boolean = false;
  loadingseart: boolean = false;
  showUnreads:boolean = false;
  constructor(
    private chatService: ChatService,
    private userService: UsuarioService,
    private utilities: UtilitiesService
  ) {}
  ngAfterViewInit(): void {
    this.getRefs();
  }
  subscriptions: Subscription[] = [];
  ngOnInit(): void {
    let tempSub: Subscription;
    this.currentUser = this.userService.getAuthUser();
    this.userService.getTodosUsuarioAll().subscribe((response) => {
      this.userList = response.data.map((element: any) => {
        return {
          id: element.id,
          name: element.nombre_completo,
          phone: element.celular,
          image: element.foto,
          status: false,
        };
      });
      this.userList = this.userList.filter((element: any) => {
        return element.id !== this.userService.getAuthUser().sub;
      });
      this.usersObtained = true;
      if (!this.syncConnected && this.connectedUsersObtained) {
        //llegaron los usuarios conectados y no estan sincronizados
        this.syncConnectedUsers();
      }
    });
    tempSub = this.chatService
      .getMessage()
      .subscribe((data: { de: number; mensaje: string; metadata: any }) => {
        this.utilities.playSound('assets/sounds/recived-message.mpeg');
        //TODO: hacer algo con el mensaje de confirmacion
        this.roomsArray = this.chatService.getStorage();
        const roomIndex = this.roomsArray.findIndex(
          (storage: any) => storage.roomId === data.de
        );
        this.messageArray = [];
        if (roomIndex > -1) {
          this.roomsArray[roomIndex].chats.push({
            fromUserId: data.de,
            message: data.mensaje,
          });
        } else {
          const updateStorage = {
            roomId: data.de,
            chats: [
              {
                fromUserId: data.de,
                message: data.mensaje,
              },
            ],
            ultimo_mensaje: data.metadata.message.contenido,
            fecha_ultimo_mensaje: data.metadata.message.fecha_creacion,
          };
          this.roomsArray.push(updateStorage);
        }
        this.chatService.setStorage(this.roomsArray);
        this.setUltimo(data);
        if (
          this.chatOpen &&
          this.Onlist == false &&
          this.selectedUser.id == data?.de
        ) {
          this.chatService.setReaded(this.selectedUser.id).subscribe(
            () => {},
            (err) => {}
          );
        } else {
          this.setUnreadCount(data?.de);
        }
        /*Carga los mensajes del la sala del usuario seleccionado*/
        this.loadRoomMessages();
        this.scrollToBottom();
      });

    this.chatService.requestLastConectedUsers();
    this.chatService.getConectedUsers().subscribe((data: any[]) => {
      if (this.connectedUsersObtained) {
        return;
      }
      this.connectedUsers = data.map((element: any) => {
        return {
          id: element.id,
          name: element.nombre_completo,
          phone: element.celular,
          image: element.foto,
          status: true,
        };
      });
      this.connectedUsers = this.connectedUsers.filter((element: any) => {
        return element.id !== this.userService.getAuthUser().sub;
      });
      this.connectedUsersObtained = true;
      if (!this.syncConnected && this.usersObtained) {
        //se tienen los usuarios del sistema y no estan sincronizados
        this.syncConnectedUsers();
      }
    });

    this.chatService.getConfirmMessage().subscribe((data) => {
      this.setUltimo(data);
    });
    this.chatService.getLastUserConnected().subscribe((userId) => {
      let index = this.userList.findIndex((user) => {
        return user?.id == userId;
      });
      if (index > -1 && this.syncConnected) {
        this.userList[index].status = true;
        this.onSearch();
      }
    });

    this.chatService.getLastUserDisconnected().subscribe((userId) => {
      let index = this.userList.findIndex((user) => {
        return user?.id == userId;
      });
      if (index > -1 && this.syncConnected) this.userList[index].status = false;
      this.onSearch();
    });
  }

  syncConnectedUsers() {
    this.connectedUsers.forEach((element) => {
      let index = this.userList.findIndex((user) => {
        return user?.id == element?.id;
      });
      if (index > -1) this.userList[index].status = true;
    });
    this.filteredUserList = this.userList.slice();
    this.syncConnected = true;
    this.orderRecentChats();
  }

  orderRecentChats() {
    this.chatService.getUltimosMensajes().subscribe(
      (response) => {
        this.recents = response?.data?.ultimos;
        this.unreads = response?.data?.unreads?.chats;
        this.totalUnreads = response?.data?.unreads?.totalCount;
        let usersOrder: any[] = [];
        this.recents?.forEach((recent) => {
          let userId: number;
          if (recent.usuario_emisor_id == this.userService.getAuthUser().sub) {
            userId = recent?.usuario_receptor_id;
          } else {
            userId = recent?.usuario_emisor_id;
          }
          let index = this.userList?.findIndex((element) => {
            return element?.id == userId;
          });
          if (index > -1) {
            this.userList[index].last_message = recent.contenido;
            this.userList[index].created_at = recent.fecha_creacion;
            usersOrder.push(this.userList[index]);
            this.userList.splice(index, 1);
          }
        });
        this.userList = usersOrder.concat(this.userList);

        this.unreads.forEach((element) => {
          let index = this.userList.findIndex((user) => {
            return user?.id == element.usuario_emisor_id;
          });
          if (index > -1) {
            this.userList[index].unreadsCount = element.count;
          }
        });
        this.filteredUserList = this.userList.slice();
      },
      (err) => {}
    );
  }

  loadRoomMessages() {
    if (this.selectedUser) {
      const roomIndex = this.roomsArray.findIndex(
        (storage: any) => storage.roomId === this.selectedUser.id
      );
      if (roomIndex > -1) {
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

    if (roomIndex == -1) {
      const updateStorage = {
        roomId: this.selectedUser.id,
        chats: [],
        ultimo_mensaje: '',
        fecha_ultimo_mensaje: '',
      };
      this.roomsArray.push(updateStorage);
      roomIndex = this.roomsArray.length - 1;
    }

    this.chatService
      .getChatMessages(this.selectedUser.id)
      .subscribe((response: { data: any[] }) => {
        this.roomsArray[roomIndex].chats = response.data?.map((message) => {
          return {
            fromUserId: message.usuario_emisor_id,
            message: message.contenido,
          };
        });
        this.chatService.setStorage(this.roomsArray);
        this.messageArray = this.roomsArray[roomIndex].chats;
        this.scrollToBottom();
        let tempCount: number=0;
        let index = this.userList.findIndex((element) => {
          return element.id == this.selectedUser.id;
        });
        if (index > -1) {
        if (
          this.userList[index].unreadsCount == null ||
          this.userList[index].unreadsCount == 0
        ) {
          this.userList[index].unreadsCount = 0;
        } else {
          tempCount = this.userList[index].unreadsCount;
          this.totalUnreads -= tempCount;
          this.userList[index].unreadsCount = 0;
        }
        }

        this.chatService.setReaded(this.selectedUser.id).subscribe(
          () => {},
          (err) => {
            if (index > -1) this.userList[index].unreadsCount = tempCount;
            this.totalUnreads += tempCount;
          }
        );
      });

    //this.join(this.currentUser.name, this.roomId);
  }

  join(username: string, roomId: string): void {
    this.chatService.joinRoom({ user: username, room: roomId });
  }

  sendMessage(): void {

    if (!this.messageText) {
      return;
    }
    this.chatService.sendMessage({
      uid: this.selectedUser.id,
      mensaje: this.messageText,
    });

    this.utilities.playSound('assets/sounds/sendmessage.wav');

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
        ultimo_mensaje: '',
        fecha_ultimo_mensaje: '',
      };
      this.roomsArray.push(updateStorage);
      this.messageArray = this.roomsArray[this.roomsArray.length - 1].chats;
    }
    this.chatService.setStorage(this.roomsArray);
    this.messageText = '';
    this.scrollToBottom();
    //this.ref.detectChanges();
  }

  scrollToBottom(): void {
    setTimeout(() => {
      let el = document.querySelector('#chatBodyContainer');
      el!.scrollTop = el?.scrollHeight!;
    }, 50);
  }

  back() {
    this.Onlist = true;
  }
  openChat() {
    this.chatOpen = true;
  }
  closeChat() {
    this.chatOpen = false;
    this.Onlist = true;
  }

  onSearch() {
    this.filteredUserList = this.userList.filter((element) =>
      element?.name?.toLowerCase().includes(this.textSearch.toLowerCase())
    );
  }

  unreadFilter(){
    this.showUnreads = true;
    this.filteredUserList = this.userList.filter(
      (element)=>{
        return element.unreadsCount > 0;
      }
    )
  }

  cancelUnreadFilter(){
    this.showUnreads = false;
    this.onSearch();
  }
  getUltimo(userId: number) {
    let index = this.recents.findIndex((element) => {
      return element.chat_id == this.userService.getAuthUser().sub + userId;
    });

    if (index > -1) {
      return this.recents[index];
    } else {
      return null;
    }
  }

  getUnreadCount(userId: number) {
    let index = this.unreads.findIndex((element) => {
      return element.chat_id == this.userService.getAuthUser().sub + userId;
    });

    if (index > -1) {
      return this.unreads[index];
    } else {
      return null;
    }
  }

  setUltimo(data: { de: number; mensaje: string; metadata: any }) {
    let index = this.recents.findIndex((element) => {
      return (
        element.chat_id ==
        data?.metadata?.message?.usuario_emisor_id +
          data?.metadata?.message?.usuario_receptor_id
      );
    });
    if (index > -1) {
      this.recents[index].contenido = data?.mensaje;
      this.recents[index].fecha_creacion =
        data?.metadata?.message?.fecha_creacion;
    } else {
      let newRecent = data.metadata.message;
      newRecent.chat_id =
        newRecent.usuario_emisor_id + newRecent.usuario_receptor_id;
      this.recents.push(newRecent);
    }

    let roomId: number;
    if (
      data?.metadata?.message?.usuario_emisor_id ==
      this.userService.getAuthUser().sub
    ) {
      roomId = data?.metadata?.message?.usuario_receptor_id;
    } else {
      roomId = data?.metadata?.message?.usuario_emisor_id;
    }

    let roomIndex = this.userList.findIndex((user) => {
      return user.id == roomId;
    });

    if (roomIndex > -1) {
      let user = this.userList[roomIndex];
      user.last_message = data.mensaje;
      user.created_at = data?.metadata?.message?.fecha_creacion;
      this.userList.splice(roomIndex, 1);
      this.userList.splice(0, 0, user);
      this.onSearch();
    }
  }

  dateFromX(date: string) {
    return dayjs(date).fromNow(true);
  }

  getRefs(){
    this.chatService.getOpenChatUserObservable().subscribe(
      (userId:string)=>{
        this.chatOpen = true;
        setTimeout(()=>{
          if(!this.Onlist){
            this.back();
          }
          setTimeout(()=>{
            let userRef = document.getElementById(userId);
            userRef?.click()
          },3)
        },3)

      }
    )
  }

  setUnreadCount(idUsuarioEmisor: number) {
    let index = this.userList.findIndex((user) => {
      return (user.id = idUsuarioEmisor);
    });

    if (index > -1) {
      if (
        this.userList[index].unreadsCount != null &&
        this.userList[index].unreadsCount != undefined
      ) {
        this.userList[index].unreadsCount =
          this.userList[index].unreadsCount + 1;
      } else {
        this.userList[index].unreadsCount = 1;
      }
    }
    this.totalUnreads++;
    this.onSearch();
  }

  toString(id: number) {
    return JSON.stringify(id);
  }
  borrarBusqueda() {
    this.textSearch = '';
    this.borrarseart = false;
  }
  onKey(event: any) {
    if (event.target.value !== '') {
      this.borrarseart = true;
    } else if (event.target.value == '') {
      this.borrarseart = false;
    }
  }
}
