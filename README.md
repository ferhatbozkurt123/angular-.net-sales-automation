# 🏪 Kale Stok Takip Sistemi

## 📋 Genel Bakış
Kale Stok Takip Sistemi, modern işletmelerin ihtiyaçlarına yönelik geliştirilmiş kapsamlı bir yönetim sistemidir. Angular ve .NET Core teknolojileri kullanılarak geliştirilen bu sistem, işletmenizin tüm stok, satış, müşteri ve tedarikçi süreçlerini tek bir platformda yönetmenizi sağlar.

## 🎯 Temel Özellikler

### 📦 Stok Yönetimi
- **Ürün İşlemleri**
  - Yeni ürün ekleme ve düzenleme
  - Toplu ürün güncelleme
  - Ürün silme ve arşivleme
  - Ürün görseli yükleme ve yönetimi
  
- **Kategori Yönetimi**
  - Kategori oluşturma ve düzenleme
  - Kategorilere ürün atama
  - Kategori bazlı raporlama

- **Stok Takibi**
  - Gerçek zamanlı stok seviyesi kontrolü
  - Minimum stok uyarı sistemi
  - Stok giriş/çıkış logları
  - Barkod sistemi entegrasyonu

### 💰 Satış Yönetimi
- **Satış İşlemleri**
  - Hızlı satış ekranı
  - Çoklu ödeme seçenekleri
  - Fatura ve fiş basımı
  - İade işlemleri
  
- **Raporlama**
  - Günlük/Haftalık/Aylık satış raporları
  - Ürün bazlı satış analizleri
  - Kar/zarar analizleri
  - Özelleştirilebilir rapor şablonları

### 👥 Müşteri İlişkileri (CRM)
- **Müşteri Yönetimi**
  - Müşteri kaydı oluşturma
  - Müşteri bilgilerini düzenleme
  - Müşteri gruplandırma
  
- **Cari Hesap Takibi**
  - Borç/alacak takibi
  - Ödeme geçmişi
  - Vade takibi
  - Otomatik bakiye güncelleme

### 🏭 Tedarikçi Yönetimi
- **Tedarikçi İşlemleri**
  - Tedarikçi kaydı ve düzenleme
  - Sipariş yönetimi
  - Ödeme takibi
  - Tedarikçi performans analizi

## 💻 Teknik Özellikler

### Frontend (Angular)
- Angular 17+ kullanımı
- Material Design UI bileşenleri
- Responsive tasarım
- Modüler yapı
- Lazy loading optimizasyonu

### Backend (.NET Core)
- .NET 8.0
- Entity Framework Core
- REST API mimarisi
- JWT tabanlı kimlik doğrulama
- SOLID prensiplerine uygun tasarım

### Veritabanı
- Microsoft SQL Server
- Entity Framework Code First yaklaşımı
- Stored Procedure optimizasyonu
- Otomatik yedekleme sistemi

## 🛠️ Kurulum

### Sistem Gereksinimleri
- Windows 10/11 işletim sistemi
- İnternet bağlantısı
- Minimum 4GB RAM
- 1GB boş disk alanı
- Microsoft SQL Server (2019 veya üzeri)

### Kurulum Adımları
1. KaleStokTakip klasörünü bilgisayarınıza kopyalayın
2. `appsettings.json` dosyasında veritabanı bağlantı ayarlarını yapın
3. `start.bat` dosyasını çalıştırın
4. Tarayıcınızda otomatik olarak açılan uygulamayı kullanmaya başlayın

### Veritabanı Kurulumu
1. SQL Server Management Studio'yu açın
2. Yeni bir veritabanı oluşturun
3. `appsettings.json` dosyasındaki connection string'i güncelleyin
4. Uygulama ilk çalıştığında tabloları otomatik oluşturacaktır

## 👥 Kullanıcı Rolleri ve Yetkiler

### Admin
- Tam sistem yetkisi
- Kullanıcı yönetimi
- Sistem ayarları
- Tüm raporlara erişim

### Satış Personeli
- Satış işlemleri
- Stok görüntüleme
- Müşteri işlemleri
- Temel raporlar

### Muhasebe
- Finansal işlemler
- Cari hesap yönetimi
- Ödeme işlemleri
- Finansal raporlar

### Depo Personeli
- Stok giriş/çıkış
- Ürün düzenleme
- Tedarik işlemleri
- Stok raporları

## 📊 Raporlama Sistemi

### Satış Raporları
- Günlük satış raporu
- Ürün bazlı satış analizi
- Personel performans raporu
- Dönemsel karşılaştırmalar

### Stok Raporları
- Stok durumu
- Hareket raporu
- Minimum stok raporu
- Ürün değerleme raporu

### Finans Raporları
- Kar/zarar analizi
- Tahsilat raporu
- Borç/alacak durumu
- Vade analizi

## 🔒 Güvenlik Özellikleri
- Rol tabanlı yetkilendirme
- JWT token authentication
- SQL injection koruması
- XSS koruması
- Şifreleme ve hash işlemleri
- İşlem logları

## 🔧 Sorun Giderme

### Uygulama Başlatma Sorunları
1. Windows Güvenlik Duvarı ayarlarını kontrol edin
2. 7294 portunu kullanan başka bir uygulama olmadığından emin olun
3. Uygulamayı yönetici olarak çalıştırın
4. Event Viewer'dan hata loglarını kontrol edin

### Veritabanı Bağlantı Sorunları
1. SQL Server servisinin çalıştığından emin olun
2. Connection string doğruluğunu kontrol edin
3. Firewall kurallarını kontrol edin
4. SQL Server authentication modunu kontrol edin

### Performans Sorunları
1. IIS uygulama havuzu ayarlarını kontrol edin
2. SQL Server index optimizasyonunu yapın
3. Application Pool recycling ayarlarını kontrol edin
4. Temporary ASP.NET dosyalarını temizleyin

## 📱 Mobil Uyumluluk
- Responsive tasarım
- Mobile-first yaklaşım
- Touch-friendly arayüz
- PWA desteği

## 🔄 Otomatik Yedekleme
- Günlük veritabanı yedeği
- Dosya sistemi yedeği
- Yedek doğrulama
- Yedekten geri yükleme

## 📞 Destek ve İletişim
- Teknik destek: support@kalestoktakip.com
- Telefon: +90 xxx xxx xx xx
- Çalışma saatleri: 09:00 - 18:00 (Hafta içi)
- Online destek sistemi

## 🔄 Sürüm Geçmişi

### Versiyon 1.0.0 (Mayıs 2024)
- İlk sürüm yayınlandı
- Temel modüller aktif
- Veritabanı optimizasyonları
- Kullanıcı arayüzü iyileştirmeleri

### Planlanan Güncellemeler
- E-fatura entegrasyonu
- Mobil uygulama
- Çoklu dil desteği
- Cloud backup sistemi

## 🌐 Sistem Mimarisi
- N-Tier Architecture
- Repository Pattern
- Dependency Injection
- CQRS Pattern
- Service Layer Pattern

## 📜 Lisans
Bu yazılım [Lisans Adı] altında lisanslanmıştır. Detaylı bilgi için LICENSE dosyasını inceleyebilirsiniz.

## 🤝 Katkıda Bulunma
1. Fork the Project
2. Create your Feature Branch
3. Commit your Changes
4. Push to the Branch
5. Open a Pull Request

---
© 2024 Kale Stok Takip Sistemi. Tüm hakları saklıdır. 