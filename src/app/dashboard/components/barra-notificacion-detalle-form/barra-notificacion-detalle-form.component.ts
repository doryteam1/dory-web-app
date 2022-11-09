import { PlatformLocation, DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import {
  AngularEditorComponent,
  AngularEditorConfig,
} from '@kolkov/angular-editor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ElectronjsService } from 'src/app/services/electronjs.service';
import { TopAlertNotifyService } from 'src/app/services/top-alert-notify.service';
import { AppModalService } from 'src/app/shared/services/app-modal.service';
interface alert {
  texto: string;
  status: number;
  color: any;
}
declare var window: any;
@Component({
  selector: 'app-barra-notificacion-detalle-form',
  templateUrl: './barra-notificacion-detalle-form.component.html',
  styleUrls: ['./barra-notificacion-detalle-form.component.scss'],
})
export class BarraNotificacionDetalleFormComponent implements OnInit {
  @ViewChild('angualarEditor') angualarEditor!: AngularEditorComponent;
  @ViewChild('miModal')
  miModal!: ElementRef;
  htmlContent: any =
    '&#160;Digita aqu&#237; tu&#160;<span class="AzulDoryText"></span><span class="AzulDoryText"><b>publicaci&#243;n. <font color="#e7d508">El</font>&#160;</b><font color="#e70808">n&#250;mero de caracteres permitidos</font><b>&#160; es 200</b></span>';
  htmlContentCopy: any = '';
  color: string = '#000000';
  toggle: boolean = false;
  onPublicar: number = 0;
  publicacion!: alert;
  textSelect: string = '';
  urlSelect: any;
  nodeSelect: any;
  formModal: any;
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    showToolbar: true,
    placeholder: 'Ingrese su publicación',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    customClasses: [
      {
        name: 'AzulDoryText',
        class: 'AzulDoryText',
      },
      {
        name: 'GrisOscuroText',
        class: 'GrisOscuroText',
      },
    ],
    toolbarHiddenButtons: [
      [
        'undo',
        'redo',
        // 'bold',
        'italic',
        // 'underline',
        'strikeThrough',
        'subscript',
        // 'superscript',
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'justifyFull',
        'indent',
        'outdent',
        'insertUnorderedList',
        'insertOrderedList',
        'heading',
        'fontName',
      ],
      [
        'fontSize',
        //'textColor',
        'backgroundColor',
        //'customClasses',
        // 'link',
        // 'unlink',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode',
      ],
    ],
  };
  loading: boolean = false;
  constructor(
    private topAlertNotifyService: TopAlertNotifyService,
    public platformLocation: PlatformLocation,
    private appModalService: AppModalService,
    private modalService: NgbModal,
    public electronjsService: ElectronjsService,
    @Inject(DOCUMENT) private document: Document,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargaService();
  }

  ok() {
    this.electronjsService?.send('dialog');
    this.electronjsService?.on('onDialog', (event: any, arg: string) => {
      console.log(arg)
      this.createLink(arg)
      this.cdRef.detectChanges();
    });
    this.electronjsService?.removeAllListeners('dialog');
  }
  cargaService() {
    this.topAlertNotifyService.getTopAlert().subscribe(
      (response) => {
        console.log(response);
        if (response.data.length > 0) {
          this.publicacion = response.data[0];
          if (this.publicacion.texto) {
            this.htmlContent = this.publicacion.texto;
          }
          if (this.publicacion.color) {
            this.color = this.publicacion.color;
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onKeyup(eventHtmlx: any, htmlContent: any) {
    let texts: ElementRef<HTMLElement> = this.angualarEditor.textArea;
    if (texts.nativeElement?.innerText.length <= 200) {
      this.htmlContentCopy = htmlContent;
    } else {
      this.htmlContent = this.htmlContentCopy;
    }
  }

  colorPicker() {
    if (this.toggle) {
      this.toggle = false;
    } else {
      this.toggle = true;
    }
  }
  savePublic() {
    this.config.editable = false;
    this.config.showToolbar = false;
    this.toggle = false;
    this.loading = true;
    let newAlert: alert = {
      texto: this.htmlContent,
      color: this.color,
      status: 0,
    };
    this.topAlertNotifyService.updateParcialTopAlert(newAlert).subscribe(
      (response) => {
        this.goBack();
        this.loading = false;
      },
      (err) => {
        this.goBack();
        console.log(err);
        this.loading = false;
      }
    );
  }
  openModal() {
    if (this.textSelect) {
      this.platformLocation.onPopState(() => {
        this.appModalService.closeModalInsertLink();
      });
      this.appModalService
        .modalInsertLink(this.urlSelect)
        .then((result: any) => {
          let res: string = result;
          if (res) {
            this.createLink(res);
          }
          /*   if (result) {
          } else {
            url = '';
          } */
          /*   for (let index = 0; index < this.urlSelect.length; index++) {
      this.document.getSelection()!.removeAllRanges();
      var seleccion = document.createRange();
       const element = this.urlSelect[index];
       seleccion.selectNodeContents(element);
       console.log(seleccion);
       this.document.getSelection()!.addRange(seleccion);
      } */
        })
        .catch((result) => {});
    }
    /*  return 'https://stackblitz.com/edit/ng-dompurify-demo?file=src%2Fapp%2Fapp.component.html'; */
  }
  verfySelect() {
    const nodes: any = [];
    if (this.document.getSelection()) {
      const sel: Selection | null = this.document.getSelection();
      if (sel?.getRangeAt && sel.rangeCount) {
        /* console.log(sel.getRangeAt(0)); */
        for (let index = 0; index < sel.rangeCount; index++) {
          nodes.push.apply(
            nodes,
            this.getRangeSelectedNodes(sel.getRangeAt(index), true)
          );
        }
        /*  this.nodeSelect = this.getRangeSelectedNodes(sel.getRangeAt(0),true); */
        this.urlSelect = nodes;
        console.log(nodes);
        this.textSelect = sel!.toString();
      }
    }
  }

  goBack() {
    this.platformLocation.back();
  }
  createLink(url: any) {
    if (!url.includes('http')) {
      this.document.execCommand('createlink', false, url);
    } else {
      const newUrl =
        '<a href="' + url + '" target="_blank">' + this.textSelect + '</a>';
      this.insertHtml(newUrl);
    }
  }
  insertHtml(html: any) {
    console.log(html);
    const isHTMLInserted = this.document.execCommand('insertHTML', false, html);
    if (!isHTMLInserted) {
      throw new Error('Unable to perform the operation');
    }
  }
  getRangeSelectedNodes(range: any, includePartiallySelectedContainers: any) {
    let node = range.startContainer;
    const endNode = range.endContainer;
    let rangeNodes = [];
    // Special case for a range that is contained within a single node
    if (node === endNode) {
      rangeNodes = [node];
    } else {
      // Iterate nodes until we hit the end container
      while (node && node !== endNode) {
        rangeNodes.push((node = this.nextNode(node)));
      }
      // Add partially selected nodes at the start of the range
      node = range.startContainer;
      while (node && node !== range.commonAncestorContainer) {
        rangeNodes.unshift(node);
        node = node.parentNode;
      }
    }
    // Add ancestors of the range container, if required
    /* if (includePartiallySelectedContainers) {
          node = range.commonAncestorContainer;
          while (node) {
            rangeNodes.push(node);
            node = node.parentNode;
          }
        } */

    return rangeNodes;
  }
  nextNode(node: any) {
    if (node.hasChildNodes()) {
      return node.firstChild;
    } else {
      while (node && !node.nextSibling) {
        node = node.parentNode;
      }
      if (!node) {
        return null;
      }
      return node.nextSibling;
    }
  }
}
