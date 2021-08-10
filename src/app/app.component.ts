import { Subject, tap, merge, startWith } from "rxjs";
import { html, render } from "lit";
import { FormControl } from '@quinntyne/reactive-forms';
import { repeat } from 'lit/directives/repeat';
import { classMap } from 'lit/directives/class-map.js'
import { Status, ToDo } from "./models";


import "./app.component.scss";

export class AppComponent extends HTMLElement {
    
    _saveAction : Subject<void> = new Subject();

    _completeAction: Subject<ToDo> = new Subject(); 
    
    description: FormControl = new FormControl(null,[]);

    toDos: ToDo[] = [];

    get template() {
        return html`
            <div>
                <h2>Create To Do</h2>
                
                <form>
                    
                    <label>Description</label>
                    
                    <input type="text" is="lit-input" .formControl=${this.description}>

                </form>

                <button @click=${() => this._saveAction.next()}>
                    Save
                </button>
            </div>

            <div>
                <h2>To Dos</h2>
                <ul>
                    ${repeat(this.toDos, toDo => toDo.description, toDo => html`

                        <li @click=${() => this._completeAction.next(toDo)}>

                            <p class="${classMap({ "to-do--completed": toDo.status == Status.completed })}">${toDo.description}</p>

                            <p>${toDo.status}</p>
                            
                        </li>

                    `)}
                </ul>                
            </div>
        `;
    }

    connectedCallback() {    
        merge(            
            this._saveAction
            .pipe(
                tap(_ => {
                    this.toDos.push({
                        description: this.description.value,
                        status: Status.incomplete
                    });                    
                    this.description.setValue(null);
                })
                ), 
            this._completeAction
            .pipe(
                tap(toDo => (toDo.status = Status.completed))
            )                
        )
        .pipe(
            startWith(true),
            tap(_ => render(this.template, this))
        ).subscribe();         
    }    
}

export function registerApp() {
    try {
      customElements.define('ce-app', AppComponent);
    } catch {
      console.warn('ce-app already registered');
    }
}
