import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { SupabaseService } from '../_services/supabase.service';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search-name',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  templateUrl: './search-name.component.html',
  styleUrl: './search-name.component.css'
})
export class SearchNameComponent implements OnInit {
  private supabaseService = inject(SupabaseService);

  searchControl = new FormControl('', Validators.required);
  names: string[] = [];
  filteredNames!: Observable<string[]>;

  @Output() selectedName = new EventEmitter<string>();

  async ngOnInit() {
    this.names = (await this.supabaseService.getNames()).map(x => x.Name);
    this.filteredNames = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.selectedName.emit(value || '');
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value?.toLowerCase() || '';
    return this.names.filter(option => option.toLowerCase().includes(filterValue));
  }
}
