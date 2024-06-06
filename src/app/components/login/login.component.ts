import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UserService } from './user.service';
import { Renderer2, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit {
  constructor(
    private userService: UserService,
    private renderer: Renderer2,
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Script del carrusel de imágenes
      let currentSlide: number = 0;
      const slides = this.el.nativeElement.querySelectorAll('.slide');
      const totalSlides: number = slides.length;

      if (totalSlides > 0) {
        this.renderer.addClass(slides[currentSlide], 'active');

        setInterval(() => {
          this.renderer.removeClass(slides[currentSlide], 'active');
          currentSlide = (currentSlide + 1) % totalSlides;
          this.renderer.addClass(slides[currentSlide], 'active');
        }, 3000);
      }

      // Manejar el formulario de inicio de sesión
      const formLogin = this.el.nativeElement.querySelector('.login-form form') as HTMLFormElement;

      if (formLogin) {
        this.renderer.listen(formLogin, 'submit', (event: Event) => {
          event.preventDefault();
          event.stopPropagation();

          const emailOrUsername = (this.el.nativeElement.querySelector('#email') as HTMLInputElement).value;
          const password = (this.el.nativeElement.querySelector('#pwd') as HTMLInputElement).value;

          console.log('Formulario de inicio de sesión enviado:', { emailOrUsername, password });

          const loginExitoso = this.userService.iniciarSesion(emailOrUsername, password);
          if (loginExitoso) {
            console.log('Inicio de sesión exitoso:', { emailOrUsername });
            formLogin.reset();
          } else {
            console.log('Error en el inicio de sesión.');
          }
        });
      }
    }
  }
}
