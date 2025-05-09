import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../services/category.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-category-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.scss']
})
export class CategoryAddComponent {
  categoryForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.categoryForm = this.fb.group({
      kategoriAdi: ['', [Validators.required, Validators.minLength(2)]],
      aciklama: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      console.log('Form değerleri:', this.categoryForm.value);

      // Sadece gerekli alanları gönder
      const categoryData = {
        kategoriAdi: this.categoryForm.value.kategoriAdi,
        aciklama: this.categoryForm.value.aciklama
      };

      console.log('API\'ye gönderilecek veri:', categoryData);

      this.categoryService.createCategory(categoryData)
        .subscribe({
          next: (response) => {
            console.log('Başarılı yanıt:', response);
            this.successMessage = 'Kategori başarıyla eklendi!';
            this.categoryForm.reset();
            setTimeout(() => {
              this.router.navigate(['/kategoriler']);
            }, 2000);
          },
          error: (error) => {
            console.error('API Hatası detayı:', error);
            if (error.error && typeof error.error === 'string') {
              this.errorMessage = error.error;
            } else if (error.error?.message) {
              this.errorMessage = error.error.message;
            } else if (error.message) {
              this.errorMessage = error.message;
            } else {
              this.errorMessage = 'Kategori eklenirken bir hata oluştu. Lütfen tüm alanları kontrol edin.';
            }
          }
        });
    } else {
      this.errorMessage = 'Lütfen tüm zorunlu alanları doldurun.';
    }
  }
}
