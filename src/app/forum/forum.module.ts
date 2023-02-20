import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForumRoutingModule } from './forum-routing.module';
import { ForumUserResponsesComponent } from './components/forum-user-responses/forum-user-responses.component';
import { ForumHomeComponent } from './components/forum-home/forum-home.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserQuestionForumComponent } from './components/shared/user-question-forum/user-question-forum.component';
import { UserQuestionFormForumComponent } from './components/shared/user-question-form-forum/user-question-form-forum.component';
import { UserFilterForumComponent } from './components/shared/user-filter-forum/user-filter-forum.component';
import { UserAnswersForumComponent } from './components/shared/user-answers-forum/user-answers-forum.component';
import { UserAnswersFormForumComponent } from './components/shared/user-answers-form-forum/user-answers-form-forum.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    ForumUserResponsesComponent,
    ForumHomeComponent,
    UserQuestionForumComponent,
    UserQuestionFormForumComponent,
    UserFilterForumComponent,
    UserAnswersForumComponent,
    UserAnswersFormForumComponent,
  ],
  imports: [
    CommonModule,
    ForumRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
  ],
})
export class ForumModule {}
