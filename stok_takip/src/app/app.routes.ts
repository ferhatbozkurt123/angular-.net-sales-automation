// app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UrunlerComponent } from './urunler/urunler.component';
import { SatislarComponent } from './satislar/satislar.component';
import { ReportComponent } from './report/report.component';
import { CarilerComponent } from './cariler/cariler.component';
import { CariListComponent } from './cariler/cari-list/cari-list.component';
import { CariFormComponent } from './cariler/cari-form/cari-form.component';
import { CariDetayComponent } from './cariler/cari-detay/cari-detay.component';
import { CariHareketFormComponent } from './cariler/cari-hareket-form/cari-hareket-form.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { CategoryAddComponent } from './category-add/category-add.component';
import { SalesDetailComponent } from './sales/sales-detail/sales-detail.component';
import { SalesUpdateComponent } from './sales/sales-update/sales-update.component';
import { TedarikListComponent } from './tedarik/tedarik-list/tedarik-list.component';
import { TedarikFormComponent } from './tedarik/tedarik-form/tedarik-form.component';
import { TedarikDetailComponent } from './tedarik/tedarik-detail/tedarik-detail.component';
import { UrunTedarikListComponent } from './tedarik/urun-tedarik-list/urun-tedarik-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'urunler', component: UrunlerComponent },
  { path: 'satislar', component: SatislarComponent },
  { path: 'report', component: ReportComponent },
  { path: 'urunler/ekle', component: ProductFormComponent },
  { path: 'urunler/kategori/ekle', component: CategoryAddComponent },
  { path: 'cariler', component: CarilerComponent },
  {
    path: 'tedarik',
    children: [
      { path: '', component: TedarikListComponent },
      { path: 'urun/:id', component: UrunTedarikListComponent },
      { path: 'ekle', component: TedarikFormComponent },
      { path: 'duzenle/:id', component: TedarikFormComponent },
      { path: 'detay/:id', component: TedarikDetailComponent }
    ]
  },
  {
    path: 'cari',
    children: [
      { path: 'liste', component: CariListComponent },
      { path: 'ekle', component: CariFormComponent },
      { path: 'duzenle/:id', component: CariFormComponent },
      { path: 'detay/:id', component: CariDetayComponent },
      { path: 'hareket/ekle/:id', component: CariHareketFormComponent }
    ]
  },
  {
    path: 'sales',
    children: [
      { path: 'sales-detail/:id', component: SalesDetailComponent },
      { path: 'sales-update/:id', component: SalesUpdateComponent }
    ]
  }
];