/* 
  =========================================
  WEBSITE SPA HMJTI (Himpunan Mahasiswa Jurusan Teknologi Informasi)
  VANILLA JAVASCRIPT REKAYASA & INTERAKTIVITAS
  Author: Senior Front-End Developer
  =========================================
*/

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. SELEKTOR VARIABEL UTAMA ---
  const header = document.getElementById('main-header');
  const hamburger = document.getElementById('hamburger-menu');
  const navMenu = document.getElementById('nav-menu-links');
  const navLinks = document.querySelectorAll('.nav-link, .dropdown-item');
  const backToTopBtn = document.getElementById('back-to-top-btn');
  const toastContainer = document.getElementById('toast-container');
  const modal = document.getElementById('details-modal');
  const modalClose = document.getElementById('modal-close');
  
  // --- 2. STICKY HEADER SCROLL TRIGGER ---
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.classList.add('sticky');
      // Bila bergulir melewati sirkuit gelap hero menuju area putih
      if (window.scrollY > window.innerHeight - 80) {
        header.classList.remove('dark-mode-header');
      } else {
        header.classList.add('dark-mode-header');
      }
    } else {
      header.classList.remove('sticky');
      header.classList.remove('dark-mode-header');
    }

    // --- BACK TO TOP TRIGGER ---
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('active');
    } else {
      backToTopBtn.classList.remove('active');
    }

    // --- ACTIVE NAV INDICATOR ON SCROLL ---
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetNavLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

      if (targetNavLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
          targetNavLink.classList.add('active');
        }
      }
    });
  });

  // --- 3. HAMBURGER MENU MOBILE INTERACTION ---
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // --- 4. SMART SMOOTH SCROLLING & TAB SYNCHRONIZATION ---
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      
      // Jika tautan adalah dropdown item Tentang HMJTI
      if (link.classList.contains('dropdown-item')) {
        e.preventDefault();
        
        const tabName = link.getAttribute('data-tab');
        
        // Gulir halus ke seksi utama #tentang
        const tentangSection = document.getElementById('tentang');
        if (tentangSection) {
          window.scrollTo({
            top: tentangSection.offsetTop - 80,
            behavior: 'smooth'
          });
        }
        
        // Aktifkan tab yang sesuai
        activateTentangTab(tabName);
        
        // Tutup menu mobile
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        return;
      }

      // Untuk tautan standar
      if (targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
          
          // Set kelas aktif di menu
          document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
          if (link.classList.contains('nav-link')) {
            link.classList.add('active');
          }
          
          // Tutup menu mobile
          hamburger.classList.remove('active');
          navMenu.classList.remove('active');
        }
      }
    });
  });

  // --- 5. TENTANG HMJTI TAB SYSTEM LOGIC ---
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  function activateTentangTab(tabId) {
    // Nonaktifkan semua tab
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Cari tombol yang sesuai data-tab
    const targetBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    const targetContent = document.getElementById(tabId);
    
    if (targetBtn && targetContent) {
      targetBtn.classList.add('active');
      targetContent.classList.add('active');
    }
  }

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');
      activateTentangTab(tabId);
    });
  });

  // --- 6. FLOATING BACK TO TOP FUNCTION ---
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // --- 7. KEPENGURUSAN MEMBER FILTER SYSTEM ---
  const filterButtons = document.querySelectorAll('.btn-filter');
  const pengurusCards = document.querySelectorAll('.pengurus-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle tombol aktif
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      const filterValue = button.getAttribute('data-filter');
      
      pengurusCards.forEach(card => {
        // Efek transisi mengecil/hilang
        card.style.transform = 'scale(0.8)';
        card.style.opacity = '0';
        
        setTimeout(() => {
          if (filterValue === 'all' || card.classList.contains(filterValue)) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.transform = 'scale(1)';
              card.style.opacity = '1';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        }, 200);
      });
    });
  });

  // --- 8. CUSTOM TOAST NOTIFICATION SYSTEM ---
  function showToast(title, message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const iconClass = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    toast.innerHTML = `
      <i class="fas ${iconClass} toast-icon"></i>
      <div class="toast-content">
        <h4 class="toast-title">${title}</h4>
        <p class="toast-message">${message}</p>
      </div>
      <button class="toast-close-btn" aria-label="Tutup"><i class="fas fa-times"></i></button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Close button click
    const closeBtn = toast.querySelector('.toast-close-btn');
    closeBtn.addEventListener('click', () => {
      toast.style.animation = 'fadeIn 0.2s ease reverse forwards';
      setTimeout(() => toast.remove(), 200);
    });
    
    // Auto remove setelah 4 detik
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.transform = 'translateY(-20px)';
        toast.style.opacity = '0';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }
    }, 4000);
  }

  // --- 9. DETAILS MODAL POPUP ENGINE & DATASETS ---
  const newsData = {
    'news-1': {
      title: 'Selamat! Tim DevCode HMJTI Sabet Juara 1 Hackathon Nasional 2026',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
      meta: '<span><i class="far fa-calendar-alt"></i> 18 Mei 2026</span><span><i class="far fa-user"></i> Humas HMJTI</span><span><i class="fas fa-tag"></i> Prestasi</span>',
      content: `
        <p>Kabar gembira datang dari panggung nasional! Tim delegasi riset HMJTI yang beranggotakan tiga mahasiswa berprestasi: Fauzan Aditama, Clara Amanda, dan Gavin Wiranata berhasil memboyong trophy Juara Pertama pada ajang Hackathon Nasional "Indonesian Tech Innovators 2026".</p>
        <p>Ajang bergengsi ini mempertemukan lebih dari 45 universitas ternama se-Indonesia untuk merancang solusi taktis dalam kurun waktu 24 jam non-stop pemrograman. Tim DevCode mengusung project inovatif bernama <strong>"ResQLink"</strong>, sebuah aplikasi mobile tanggap bencana berbasis IoT offline-first mesh network yang mampu menghubungkan koordinat korban bencana ke posko darurat meskipun infrastruktur seluler mati total.</p>
        <h4>Riset Panjang yang Membuahkan Hasil</h4>
        <p>Keberhasilan ini tidak didapatkan secara instan. Di bawah bimbingan langsung dosen Jurusan Teknologi Informasi, Litbang HMJTI mengawal riset jaringan nirkabel frekuensi radio sejak awal semester ganjil. Piala emas ini kami dedikasikan untuk seluruh civitas akademika Jurusan TI yang selalu mendukung ekosistem penelitian mahasiswa. Selamat untuk para pemenang, mari terus menginspirasi!</p>
      `
    },
    'news-2': {
      title: 'Mengupas Tuntas Dampak AI dalam Pengembangan Karir Software Developer',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
      meta: '<span><i class="far fa-calendar-alt"></i> 10 Mei 2026</span><span><i class="far fa-user"></i> Ristek HMJTI</span><span><i class="fas fa-tag"></i> Seminar</span>',
      content: `
        <p>Divisi Riset & Teknologi HMJTI sukses menggelar stadium general interaktif bertajuk "The AI Revolution in Software Industry". Seminar luring ini dihadiri lebih dari 350 mahasiswa TI bertempat di Aula Utama Universitas.</p>
        <p>Acara ini menghadirkan pembicara utama Bapak Adrian Hidayat selaku CTO GoTo Financial. Pembahasan hangat difokuskan pada pergeseran paradigma coding di era kehadiran Generative AI seperti Github Copilot, Gemini Code Assist, dan ChatGPT. Adrian menegaskan bahwa AI tidak akan menghilangkan profesi programmer, melainkan menuntut fungsionaris programmer berevolusi menjadi <em>AI-assisted engineers</em> yang andal.</p>
        <h4>Kunci Sukses Developer Masa Depan</h4>
        <p>Mahasiswa TI diajak untuk tidak sekadar menghafal sintaksis bahasa pemrograman, melainkan mematangkan pemahaman arsitektur sistem, pemodelan database, algoritma komputasi, serta metodologi perancangan UX. "AI sangat hebat dalam membuat kode boilerplate, tetapi kepekaan logika bisnis, mitigasi bug, dan pemikiran analitis tetap menjadi kekuasaan eksklusif manusia," ujar Adrian.</p>
      `
    },
    'news-3': {
      title: '5 Tren Pemrograman Terpopuler Tahun 2026 yang Wajib Dipelajari',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
      meta: '<span><i class="far fa-calendar-alt"></i> 02 Mei 2026</span><span><i class="far fa-user"></i> Litbang TI</span><span><i class="fas fa-tag"></i> Teknologi</span>',
      content: `
        <p>Dunia teknologi informasi bergerak dengan kecepatan eksponensial. Agar tetap relevan dan memiliki daya saing kompetitif yang tinggi pasca-kelulusan, mahasiswa Jurusan TI wajib mencermati tren bahasa pemrograman dan framework yang mendominasi industri global tahun 2026 ini.</p>
        <p>Berdasarkan survey pasar kerja IT terbaru, berikut adalah 5 tren krusial yang wajib Anda kuasai:</p>
        <ul>
          <li style="margin-bottom: 0.75rem;"><strong>1. Next-gen JS Frameworks (Zero-Bundle):</strong> Framework modern kini berfokus pada render server-side penuh dengan beban javascript browser nol guna mendongkrak skor Core Web Vitals secara radikal.</li>
          <li style="margin-bottom: 0.75rem;"><strong>2. WebAssembly (Wasm):</strong> Penulisan modul web performa tinggi menggunakan Rust atau Go yang dicompile ke Wasm kini umum digunakan di web interaktif grafik 3D dan pengolahan data lokal.</li>
          <li style="margin-bottom: 0.75rem;"><strong>3. Cloud-Native Node Engines:</strong> Penggunaan Deno dan Bun yang gesit menggantikan runtime Node.js tradisional dalam setup microservices cloud.</li>
          <li style="margin-bottom: 0.75rem;"><strong>4. Edge Computing Databases:</strong> Penyimpanan relasional global terdistribusi yang ditempatkan di server CDN terdekat untuk menihilkan latency aplikasi SPA.</li>
        </ul>
        <p>HMJTI melalui Divisi Riset & Teknologi berkomitmen untuk terus mengadakan workshop berkala guna mengajari kelima modul tren ini kepada seluruh mahasiswa secara bertahap.</p>
      `
    }
  };

  // Open Modal function
  function openModal(title, imgUrl, metaHtml, contentHtml) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-img').src = imgUrl;
    document.getElementById('modal-meta').innerHTML = metaHtml;
    document.getElementById('modal-text').innerHTML = contentHtml;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  }

  // Close Modal function
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Unlock background scroll
  }

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Attach event to News "Baca Selengkapnya" buttons
  const readMoreButtons = document.querySelectorAll('.btn-read-more');
  readMoreButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const dataId = btn.getAttribute('data-target');
      const news = newsData[dataId];
      if (news) {
        openModal(news.title, news.image, news.meta, news.content);
      }
    });
  });

  // Attach event to Academic Project detail triggers
  const projectTriggers = document.querySelectorAll('.detail-project-trigger');
  projectTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const title = trigger.getAttribute('data-project-title');
      const desc = trigger.getAttribute('data-project-desc');
      const image = trigger.closest('.project-item').querySelector('.project-img img').src;
      
      const meta = '<span><i class="fas fa-trophy" style="color: gold;"></i> Hasil Project Unggulan Mahasiswa</span>';
      const content = `
        <p>${desc}</p>
        <h4 style="margin-top: 1.5rem;">Fitur Unggulan Proyek:</h4>
        <ul>
          <li><i class="fas fa-check" style="color: var(--color-primary); margin-right: 0.5rem;"></i> Antarmuka Responsif & Estetis</li>
          <li><i class="fas fa-check" style="color: var(--color-primary); margin-right: 0.5rem;"></i> Optimasi Query Database Cepat</li>
          <li><i class="fas fa-check" style="color: var(--color-primary); margin-right: 0.5rem;"></i> Integrasi API Pihak Ketiga</li>
        </ul>
        <p style="margin-top: 1.5rem;"><a href="#" class="btn btn-primary" onclick="alert('Membuka Repositori Kode di GitHub... (Mockup)'); return false;"><i class="fab fa-github"></i> Lihat Source Code di GitHub</a></p>
      `;
      openModal(title, image, meta, content);
    });
  });

  // Attach event to Scholarship & Internships buttons
  const oppButtons = document.querySelectorAll('.detail-beasiswa-trigger, .detail-magang-trigger');
  oppButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-opp-title');
      const desc = btn.getAttribute('data-opp-desc');
      const isIntern = btn.classList.contains('detail-magang-trigger');
      
      const imgUrl = isIntern 
        ? 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80';
        
      const meta = isIntern 
        ? '<span><i class="fas fa-briefcase"></i> Karir & Magang Industri</span>' 
        : '<span><i class="fas fa-graduation-cap"></i> Beasiswa Pendidikan Mahasiswa</span>';
        
      const content = `
        <p>${desc}</p>
        <h4 style="margin-top: 1.5rem;">Alur Pengajuan Rekomendasi HMJTI:</h4>
        <p>Bagi mahasiswa TI yang ingin melamar program di atas dan memerlukan surat keterangan aktif berorganisasi dari HMJTI, silakan hubungi fungsionaris PSDM di sekretariat atau unggah permohonan melalui form Kontak di bawah.</p>
        <p style="margin-top: 1.5rem;"><button class="btn btn-primary" onclick="alert('Mengarahkan ke portal resmi pendaftaran... (Mockup)');"><i class="fas fa-external-link-alt"></i> Buka Portal Resmi</button></p>
      `;
      openModal(title, imgUrl, meta, content);
    });
  });

  // Attach event to Event Registration buttons
  const registerEventBtns = document.querySelectorAll('.btn-daftar-event');
  registerEventBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const eventName = btn.getAttribute('data-event-name');
      showToast('Registrasi Event Berhasil', `Anda telah terdaftar atau berlangganan pengingat untuk event: ${eventName}. Cek email Anda untuk konfirmasi.`, 'success');
    });
  });

  // Attach event to Gallery Grid Items
  const galleryItems = document.querySelectorAll('.galeri-item');
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const title = item.getAttribute('data-galeri-title');
      const desc = item.getAttribute('data-galeri-desc');
      const img = item.getAttribute('data-galeri-img');
      
      const meta = '<span><i class="fas fa-camera"></i> Dokumentasi Resmi HMJTI</span>';
      const content = `<p>${desc}</p><p>Foto ini diambil selama keberlangsungan agenda resmi HMJTI yang melibatkan partisipasi aktif seluruh mahasiswa Jurusan Teknologi Informasi.</p>`;
      
      openModal(title, img, meta, content);
    });
  });

  // --- 10. REALISTIC FILE DOWNLOADER SIMULATOR ---
  const downloadBtns = document.querySelectorAll('.btn-download-table');
  downloadBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filename = btn.getAttribute('data-filename');
      showToast('Mengunduh File...', `Berkas "${filename}" sedang diunduh ke sistem Anda.`, 'success');
      
      // Simulasi progress unduhan virtual
      setTimeout(() => {
        showToast('Unduhan Selesai', `Berkas "${filename}" berhasil diunduh.`, 'success');
      }, 2000);
    });
  });

  // --- 11. MAP PIN INTERACTIVE INTERACTION ---
  const mapPinBtn = document.getElementById('map-pin-btn');
  mapPinBtn.addEventListener('click', () => {
    showToast('Halo dari Sekretariat!', 'Kantor HMJTI bertempat di Gedung TI Lantai 1. Kami selalu terbuka untuk diskusi mahasiswa setiap hari kerja pukul 08.00-16.00 WIB.', 'success');
  });

  // --- 12. ASPIRASI FORM SUBMISSION VALIDATION ---
  const aspirasiForm = document.getElementById('aspirasi-form');
  aspirasiForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const namaInput = document.getElementById('aspirasi-nama').value.trim();
    const kontakInput = document.getElementById('aspirasi-kontak').value.trim();
    const kategoriSelect = document.getElementById('aspirasi-kategori').value;
    const pesanTextarea = document.getElementById('aspirasi-pesan').value.trim();
    const setujuCheckbox = document.getElementById('aspirasi-setuju').checked;
    
    // Validasi basic
    if (!kategoriSelect) {
      showToast('Gagal Mengirim', 'Mohon pilih kategori aspirasi terlebih dahulu.', 'error');
      return;
    }
    
    if (pesanTextarea.length < 15) {
      showToast('Gagal Mengirim', 'Mohon berikan detail aspirasi minimal 15 karakter agar mudah dipahami.', 'error');
      return;
    }
    
    if (!setujuCheckbox) {
      showToast('Gagal Mengirim', 'Anda harus menyetujui pernyataan kejujuran informasi.', 'error');
      return;
    }
    
    // Simulasi sukses kirim ke server
    const displayNama = namaInput || 'Anonim';
    showToast('Aspirasi Terkirim!', `Terima kasih ${displayNama}. Aspirasi mengenai "${kategoriSelect}" telah tersimpan dengan aman secara terenkripsi.`, 'success');
    
    // Reset form
    aspirasiForm.reset();
  });

  // --- 13. QUICK CONTACT FORM SUBMISSION VALIDATION ---
  const kontakForm = document.getElementById('kontak-form');
  kontakForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nama = document.getElementById('kontak-nama').value.trim();
    const email = document.getElementById('kontak-email').value.trim();
    const subjek = document.getElementById('kontak-subjek').value.trim();
    const pesan = document.getElementById('kontak-pesan').value.trim();
    
    if (!nama || !email || !subjek || !pesan) {
      showToast('Gagal Mengirim', 'Mohon lengkapi semua kolom bertanda bintang (*).', 'error');
      return;
    }
    
    // Validasi format email sederhana
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Gagal Mengirim', 'Format alamat email Anda tidak valid.', 'error');
      return;
    }
    
    if (pesan.length < 10) {
      showToast('Gagal Mengirim', 'Isi pesan terlalu pendek, minimal 10 karakter.', 'error');
      return;
    }
    
    // Simulasi sukses kirim
    showToast('Pesan Email Terkirim!', `Halo ${nama}, pesan mengenai "${subjek}" telah terkirim ke admin humas HMJTI. Salinan konfirmasi dikirim ke ${email}.`, 'success');
    
    // Reset form
    kontakForm.reset();
  });

});
