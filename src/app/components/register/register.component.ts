import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UserService } from '../login/user.service';
import { Renderer2, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-login',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements AfterViewInit {
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

      // Manejar el formulario de registro
      const formRegister = this.el.nativeElement.querySelector('.register-form form') as HTMLFormElement;

      if (formRegister) {
        this.renderer.listen(formRegister, 'submit', (event: Event) => {
          event.preventDefault();
          event.stopPropagation();

          const email = (this.el.nativeElement.querySelector('#register-email') as HTMLInputElement).value;
          const name = (this.el.nativeElement.querySelector('#register-name') as HTMLInputElement).value;
          const password = (this.el.nativeElement.querySelector('#register-password') as HTMLInputElement).value;
          const username = (this.el.nativeElement.querySelector('#register-username') as HTMLInputElement).value;
          const birthdate = (this.el.nativeElement.querySelector('#register-birthdate') as HTMLInputElement).value;

          console.log('Formulario de registro enviado:', { email, name, username, birthdate });

          const registroExitoso = this.userService.registrarUsuario(email, name, password, username, birthdate);
          if (registroExitoso) {
            console.log('Registro exitoso:', { email, name, username, birthdate });
            formRegister.reset();
          } else {
            console.log('Error en el registro.');
          }
        });
      }
    }
  }
}
