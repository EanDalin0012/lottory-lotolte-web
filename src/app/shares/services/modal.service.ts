import { Injectable } from '@angular/core';
import { StoreUtil } from '../utils/store';
import { DialogCloseResult, DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { NotificationService } from '@progress/kendo-angular-notification';
import * as $ from 'jquery';
import { TranslateService } from '@ngx-translate/core';
import { ModalDataService } from './modal-data.service';
import { ModalComponent } from '../component/modal/modal.component';
import { MODAL_STORE_KEY } from '../constants/common.const';
import { AlertDialogComponent } from '../component/alert-dialog/alert-dialog.component';
@Injectable({
  providedIn: 'root'
})
export class ModalService {
  store = new StoreUtil();
  dialogRefList: DialogRef[] = [];
  i = 0;
  constructor(
    private dialogService: DialogService,
    private modalData: ModalDataService,
    private translate: TranslateService,
    private notificationService: NotificationService
  ) { }

  /**
   * modal
   * @param content (string)
   * @param btnText (string)
   * @param modalClass (array) Modal Component
   * @param height (number) Modal Kendo ui
   * @param width (number) Modal  Kendo ui
   * @param minWidth (number) Modal Kendo ui
   */
   notice({ content = '', btnText = 'OK', modalClass = [], height = 0, width = 0, minWidth = 0 }) {
    let contentComponent: any;

    if (typeof content === 'string') {
      this.modalData.sendMessage(content.replace(/\n/gi, '<br/>'));
      contentComponent = ModalComponent;
    } else {
      contentComponent = content;
    }

    this.dialogService.open({
      content: ModalComponent,
      actions: [{
        text: btnText
      }],
      height,
      width,
      minWidth
    });

    /**
     * Modal
     */
    $('kendo-dialog').addClass(modalClass);
  }

  /**
   * modal
   * @param title (string) modal
   * @param content (string)
   * @param btnText (string)
   * @param modalClass (array) Modal Component
   * @param callback (function)
   * @param height (number) Modal
   * @param width (number) Modal
   * @param minWidth (number) Modal
   */
  alert(content: any,{ title = '', btnText = 'OK', modalClass = [], callback = (res: any) => {}, height = 0, width = 0, minWidth = 0 }) {
    let contentComponent: any;

    if (typeof content === 'string') {
      // Base Component
      this.modalData.sendMessage(content.replace(/\n/gi, '<br/>'));
      contentComponent = ModalComponent;
    } else {
      contentComponent = content;
    }

    const dialog: DialogRef = this.dialogService.open({
      title,
      content: contentComponent,
      actions: [{
        text: btnText
      }],
      height,
      width,
      minWidth
    });

    /**
     * Modal
     */
    $('kendo-dialog').addClass(modalClass);
    $('kendo-dialog').addClass('addAlert');
    $('.addAlert').eq(-1).addClass('addAlertCender');
    $('.addAlertCender').find('kendo-dialog-actions').addClass('alert-btn');
    dialog.result.subscribe((res) => {
      if (res instanceof DialogCloseResult) {
        callback(false);
      } else {
        callback(res);
      }
    });

  }

  /**
   * Confirm
   * @param title (string) modal
   * @param content (string)
   * @param lBtn (object)
   * @param lBtn.btnText (string)
   * @param lBtn.callback (function)
   * @param rBtn (object)
   * @param rBtn.btnText (string)
   * @param rBtn.callback (function)
   * @param modalClass (array) Modal Component
   * @param callback (function) modal이 close
   * @param height (number) Modal Kendo ui
   * @param width (number) Modal  Kendo ui
   * @param minWidth (number) Modal Kendo ui
   */
  confirm(
    content: any,
    {
    title = '',
    lBtn = {},
    rBtn = {},
    modalClass = [],
    callback = (res: any) => {},
    height = 0,
    width = 0,
    minWidth = 0
  }) {
    // const lBtnText = lBtn['btnText'] || 'No';
    const _lBtnText = lBtn as any;
    const lBtnText = _lBtnText['btnText'] || 'No';

   // const lBtnCallback = lBtn['callback'] || function() {};
    const _lBtnCallback = lBtn as any;
    const lBtnCallback = _lBtnCallback['callback'] || function() {};

    // const rBtnText = rBtn['btnText'] || 'Yes';
    const _rBtnText = lBtn as any;
    const rBtnText = _rBtnText['btnText'] || 'Yes';


    const _rBtnCallback = rBtn as any;
    const rBtnCallback = _rBtnCallback['callback'] || function() {};

    let contentComponent: any;

    if (typeof content === 'string') {
      // Base Component
      this.modalData.sendMessage(content.replace(/\n/gi, '<br/>'));
      contentComponent = ModalComponent;
    } else {
      contentComponent = content;
    }

    const dialog: DialogRef = this.dialogService.open({
      title,
      content: contentComponent,
      actions: [{
        text: lBtnText
      }, {
        text: rBtnText
      }],
      height,
      width,
      minWidth
    });

    $('kendo-dialog').addClass(modalClass);

    dialog.result.subscribe((res) => {
      if (res instanceof DialogCloseResult) {
        callback(false);
      } else {
        switch (res.text) {
          case lBtnText:
            lBtnCallback(res);
            callback(res);
            break;

          case rBtnText:
            rBtnCallback(res);
            callback(res);
            break;
        }
      }
    });
  }

  /**
   * @param content (component) component
   * @param message (object)
   * @param opener (object)
   * @param callback (function) modal
   * @param callback (function)
   */
  open(content: any, { message = {}, opener = {}, modalClass = [], callback = (res: any) => {} }) {
    const dialog: DialogRef = this.dialogService.open({
      content
    });
    this.dialogRefList.push(dialog);
    this.store.set(MODAL_STORE_KEY.MODAL_STORE_KEY, this.dialogRefList);
    this.i++;
    $('kendo-dialog').addClass(modalClass);
    $('body').addClass('overHidden');

    dialog.content.instance.modal = {
      message,
      callback,
      opener,
      close: (res: any) => {
        const modalStoreKey = this.store.get(MODAL_STORE_KEY.MODAL_STORE_KEY);
        modalStoreKey.splice(this.i - 1);
        dialog.close(res);
        $('body').removeClass('overHidden');
      }
    };

    dialog.result.subscribe((res) => {
      if (res instanceof DialogCloseResult) {
        callback(false);
      } else {
        callback(res);
      }
    });
  }

  showNotificationService(content: string, duration?: number, cssClass?: string, closable?:boolean) {
    console.log('cssClass',cssClass);
    let css = cssClass;
    let close = closable;
    let time = 400;
    if(duration) {
      time = duration;
    }
    if(closable == undefined) {
      close = false;
    }
    if(cssClass === undefined) {
      css = '';
    }

    if(content) {
      this.notificationService.show({
        content: content,
        cssClass: css,
        animation: { type: 'slide', duration: time },
        position: { horizontal: 'center', vertical: 'bottom' },
        type: { style: 'success', icon: true },
        closable: close
      });
    }

  }

  closeAllDialog() {
    const modalStore = this.store.get(MODAL_STORE_KEY.MODAL_STORE_KEY) as DialogRef[];
    if (modalStore) {
      if (modalStore.length > 0) {
        modalStore.forEach((element, index) => {
          modalStore[index].close(true);
        });
      }
    }
  }

  /**
   * @param content (component) component
   * @param message (object)
   * @param openAlert (object)
   * @param callback (function) modal
   * @param callback (function)
   */
  openAlert(content: any, {message = {}, opener = {}, modalClass = [], callback = (res: any) => {} }) {
    const dialog: DialogRef = this.dialogService.open({
      content: AlertDialogComponent
    });
    this.dialogRefList.push(dialog);
    this.store.set(MODAL_STORE_KEY.MODAL_STORE_KEY, this.dialogRefList);
    this.i++;
    $('kendo-dialog').addClass(modalClass);
    $('body').addClass('overHidden');

    dialog.content.instance.modal = {
      message,
      callback,
      opener,
      close: (res: any) => {
        const modalStoreKey = this.store.get(MODAL_STORE_KEY.MODAL_STORE_KEY);
        modalStoreKey.splice(this.i - 1);
        dialog.close(res);
        $('body').removeClass('overHidden');
      }
    };

    dialog.result.subscribe((res) => {
      if (res instanceof DialogCloseResult) {
        callback(false);
      } else {
        callback(res);
      }
    });
  }
}

interface lBtn {
  text: string;
}
