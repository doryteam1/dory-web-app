import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { UsuarioService } from 'src/app/services/usuario.service';
@Component({
  selector: 'app-chat-user',
  templateUrl: './chat-user.component.html',
  styleUrls: ['./chat-user.component.scss'],
})
export class ChatUserComponent implements OnInit {
  roomId!: string;
  messageText!: string;
  messageArray: { user: string; message: string }[] = [];
  private storageArray: any = [];
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
    private userService: UsuarioService
    
  ) {}

  ngOnInit(): void {
    this.chatService
      .getMessage()
      .subscribe((data: { user: string; room: string; message: string }) => {
        // this.messageArray.push(data);
        if (this.roomId) {
          setTimeout(() => {
            this.storageArray = this.chatService.getStorage();
            const storeIndex = this.storageArray.findIndex(
              (storage: any) => storage.roomId === this.roomId
            );
            this.messageArray = this.storageArray[storeIndex].chats;
          }, 500);
        }
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
  selectUserHandler(phone: any, i: any): void {
    this.Onlist = false;
    /* Verificamos si el usurio selecionado esta en la lista y retornamos sus datos */
    this.selectedUser = this.userList.find((user) => user.phone === phone);
    this.roomId = this.selectedUser.roomId[this.currentUser.id];
    /*  this.roomId = `room-${this.selectedUser.id}`; */
    console.log(this.roomId);
    this.messageArray = [];

    this.storageArray = this.chatService.getStorage();
    const storeIndex = this.storageArray.findIndex(
      (storage: any) => storage.roomId === this.roomId
    );

    if (storeIndex > -1) {
      this.messageArray = this.storageArray[storeIndex].chats;
    }

    this.join(this.currentUser.name, this.roomId);
  }

  join(username: string, roomId: string): void {
    this.chatService.joinRoom({ user: username, room: roomId });
  }

  sendMessage(): void {
    this.chatService.sendMessage({
      user: this.currentUser.name,
      room: this.roomId,
      message: this.messageText,
    });

    this.storageArray = this.chatService.getStorage();
    const storeIndex = this.storageArray.findIndex(
      (storage: any) => storage.roomId === this.roomId
    );

    if (storeIndex > -1) {
      this.storageArray[storeIndex].chats.push({
        user: this.currentUser.name,
        message: this.messageText,
      });
    } else {
      const updateStorage = {
        roomId: this.roomId,
        chats: [
          {
            user: this.currentUser.name,
            message: this.messageText,
          },
        ],
      };

      this.storageArray.push(updateStorage);
    }

    this.chatService.setStorage(this.storageArray);
    this.messageText = '';
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
