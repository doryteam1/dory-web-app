import { PlatformLocation, DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import {
  AngularEditorComponent,
  AngularEditorConfig,
} from '@kolkov/angular-editor';
import { ElectronjsService } from 'src/app/services/electronjs.service';
import { TopAlertNotifyService } from 'src/app/services/top-alert-notify.service';

interface alert {
  texto: string;
  status: number;
  color: any;
}

@Component({
  selector: 'app-barra-notificacion-detalle-form',
  templateUrl: './barra-notificacion-detalle-form.component.html',
  styleUrls: ['./barra-notificacion-detalle-form.component.scss'],
})
export class BarraNotificacionDetalleFormComponent implements OnInit {
  @ViewChild('angualarEditor') angualarEditor!: AngularEditorComponent;
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
        'backgroundColor',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode',
      ],
    ],
  };
  loading: boolean = false;
  nodeRangeTest!: Range;
  constructor(
    private topAlertNotifyService: TopAlertNotifyService,
    public platformLocation: PlatformLocation,
    public electronjsService: ElectronjsService,
    @Inject(DOCUMENT) private document: Document,
    private cdRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargaService();
    if (this.electronjsService.ipcActivo) {
      this.config.toolbarHiddenButtons = [
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
          'link',
          // 'unlink',
          'insertImage',
          'insertVideo',
          'insertHorizontalRule',
          'removeFormat',
          'toggleEditorMode',
        ],
      ];
    }
  }

  alertModalElectron() {
    if (this.textSelect) {
      this.electronjsService?.send('dialog', this.urlSelect);
      this.electronjsService?.on('onDialog', (event: any, url: string) => {
        let node: any = this.nodeRangeTest?.startContainer;
        const endNode = this.nodeRangeTest?.endContainer;
        if (node != endNode && this.urlSelect != url) {
          this.createLink(url);
        } else if (node == endNode && this.urlSelect != url) {
          this.createLink(url);
        }
        this.cdRef.detectChanges();
        this.electronjsService?.removeAllListeners('onDialog');
      });
      this.electronjsService?.removeAllListeners('dialog');
    }
    this.textSelect = '';
    this.urlSelect = '';
  }
  cargaService() {
    this.topAlertNotifyService.getTopAlert().subscribe(
      (response) => {
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
  verfySelect() {
    this.urlSelect = '';
    this.textSelect = '';
    const sel: Selection | null = this.document.getSelection();
    if (this.document.getSelection()) {
      if (sel!.toString()) {
        this.nodeRangeTest = sel!.getRangeAt(0);
        this.urlSelect = this.getRangeSelectedNodes(sel!.getRangeAt(0));
        this.textSelect = sel!.toString();
      }
    }
  }

  goBack() {
    this.platformLocation.back();
  }
  createLink(url: any) {
    if (url) {
      const newUrl =
        '<a href="' + url + '" target="_blank">' + this.textSelect + '</a>';
      this.insertHtml(newUrl);
    }
  }
  insertHtml(html: any) {
    const isHTMLInserted = this.document.execCommand('insertHTML', false, html);
    if (!isHTMLInserted) {
      throw new Error('Unable to perform the operation');
    }
  }
  getRangeSelectedNodes(range: any) {
    let node = range.startContainer;
    const endNode = range.endContainer;
    let url: string = '';
    // Special case for a range that is contained within a single node
    if (node === endNode && node.parentNode.href) {
      url = node.parentNode.href;
    } else {
      url = '';
    }
    return url;
  }
}
