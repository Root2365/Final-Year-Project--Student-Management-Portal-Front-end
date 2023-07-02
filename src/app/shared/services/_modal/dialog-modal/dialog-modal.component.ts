import {Component, Input, OnInit} from '@angular/core';
import {ModalDismissReasons, NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-dialog-modal',
  templateUrl: './dialog-modal.component.html',
  styleUrls: ['./dialog-modal.component.css']
})
export class DialogModalComponent {

  @Input() message;
  @Input() class;
  @Input() messageType;
  @Input() iconClass;

  constructor(private activeModal: NgbActiveModal,
              private translate: TranslateService) {
    activeModal.close();
    translate.addLangs(['us', 'de']);
    translate.setDefaultLang(localStorage.getItem('selected_lang'));
  }

  close() {
    this.activeModal.close();
  }
}
