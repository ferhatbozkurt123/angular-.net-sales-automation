import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private router: Router) {}

  onLogin() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Lütfen tüm alanları doldurunuz';
      return;
    }

    this.isLoading = true;
    
    // Simüle edilmiş login gecikmesi
    setTimeout(() => {
      if (this.username === 'ferhat' && this.password === '1313') {
        localStorage.setItem('isLoggedIn', 'true');
        this.router.navigate(['/urunler']);
      } else {
        this.errorMessage = 'Kullanıcı adı veya şifre hatalı!';
      }
      this.isLoading = false;
    }, 800);
  }
}