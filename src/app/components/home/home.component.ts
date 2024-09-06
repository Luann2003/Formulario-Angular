import { CommonModule } from '@angular/common';
import { Component, OnInit  } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  public storedData: any[] = []; // Inicialize como um array vazio
  editingIndex: number | null = null; // Índice do item que está sendo editado
  submitted = false; 

  public userForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    stack: new FormControl(''),
    gender: new FormControl('', Validators.required)  
  });

  ngOnInit(): void {
    const savedData = localStorage.getItem('userFormData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Verificar se é um array, caso contrário, transformar em array
        this.storedData = Array.isArray(parsedData) ? parsedData : [parsedData];
      } catch (error) {
        console.error('Erro ao converter JSON:', error);
        this.storedData = [];
      }
    } else {
      console.log('Nenhum dado encontrado no localStorage');
      this.storedData = [];
    }
  }

  onSubmit(): void {
    this.submitted = true; // Marca o formulário como enviado

    if (this.userForm.valid) {
      const formData = this.userForm.value;
      
      if (this.editingIndex !== null) {
        this.storedData[this.editingIndex] = formData;
        this.editingIndex = null;
      } else {
        this.storedData.push(formData);
      }

      localStorage.setItem('userFormData', JSON.stringify(this.storedData));
      this.userForm.reset();
      this.submitted = false; // Reseta a variável após o sucesso do envio
    }
  }

  loadDataForEditing(data: any): void {
    this.userForm.patchValue(data); // Atualiza o formulário com os dados fornecidos
  }

  editItem(index: number): void {
    this.editingIndex = index; 
    const itemToEdit = this.storedData[index];
    this.userForm.patchValue(itemToEdit);
  }


    deleteItem(index: number) : void {
      this.storedData.splice(index, 1); 
      localStorage.setItem('userFormData', JSON.stringify(this.storedData)); 
    }
    
   get name() {
    return this.userForm.get('name')!;
   }

   get email() {
    return this.userForm.get('email')!;
   }

   get gender() {
    return this.userForm.get('gender')!;
   }
}

