/* ==========================================================================
   VILLA FRESH — catálogo estático funcional
   Sin backend: filtra en el navegador y cierra el pedido por WhatsApp.
   El carrito vive en memoria (se pierde al recargar) — no hace falta más
   mientras el pedido se confirme por WhatsApp.
   ========================================================================== */
(function () {
  'use strict';

  var productos  = window.VF_PRODUCTOS  || [];
  var categorias = window.VF_CATEGORIAS || [];
  var telefono   = window.VF_TELEFONO   || '51994647840';

  var carrito = [];                 // [{sku, cantidad}]
  var activas = new Set();          // categorías marcadas; vacío = todas

  var $ = function (s, r) { return (r || document).querySelector(s); };

  function soles(n) { return 'S/ ' + n.toFixed(2); }
  function porSku(sku) { return productos.find(function (p) { return p.sku === sku; }); }
  function visibles() {
    return activas.size === 0
      ? productos
      : productos.filter(function (p) { return activas.has(p.categoria); });
  }
  function totalUnidades() {
    return carrito.reduce(function (a, l) { return a + l.cantidad; }, 0);
  }
  function totalSoles() {
    return carrito.reduce(function (a, l) {
      var p = porSku(l.sku);
      return a + (p && p.precio ? p.precio * l.cantidad : 0);
    }, 0);
  }
  function hayPendientes() {
    return carrito.some(function (l) { var p = porSku(l.sku); return p && p.precio === null; });
  }

  /* ---------- filtros ---------- */
  function pintarFiltros() {
    var cont = $('#vf-filtros');
    if (!cont) return;
    cont.innerHTML = '';
    categorias.forEach(function (c) {
      var n = productos.filter(function (p) { return p.categoria === c.id; }).length;
      if (!n) return;
      var l = document.createElement('label');
      l.className = 'chk';
      l.innerHTML = '<input type="checkbox" value="' + c.id + '"><span>' + c.nombre + '</span><span class="n">' + n + '</span>';
      l.querySelector('input').addEventListener('change', function (e) {
        if (e.target.checked) activas.add(c.id); else activas.delete(c.id);
        pintarGrilla();
      });
      cont.appendChild(l);
    });
  }

  /* ---------- grilla ---------- */
  function pintarGrilla() {
    var grid = $('#vf-grid');
    var cuenta = $('#vf-cuenta');
    if (!grid) return;
    var lista = visibles();
    if (cuenta) cuenta.textContent = lista.length + (lista.length === 1 ? ' producto' : ' productos');

    if (!lista.length) {
      grid.className = '';
      grid.innerHTML = '<div class="empty">Ningún producto en esa selección</div>';
      return;
    }
    grid.className = 'grid';
    grid.innerHTML = lista.map(function (p) {
      var precio = p.precio !== null
        ? '<div class="price">' + soles(p.precio) + ' <small>' + p.unidad + '</small></div>'
        : '<div class="price pending">A cotizar</div>';
      var tag = p.etiqueta ? '<span class="tag">' + p.etiqueta + '</span>' : '';
      return '<article class="card">' +
        '<div class="shot">' + tag + '<img src="' + p.imagen + '" alt="' + p.nombre + '" loading="lazy"></div>' +
        '<div class="sku">' + p.sku + '</div>' +
        '<h3>' + p.nombre + '</h3>' +
        '<p class="desc">' + p.desc + '</p>' +
        '<div class="foot-row">' + precio +
          '<button class="btn btn-cyan btn-sm" data-add="' + p.sku + '">Agregar</button>' +
        '</div></article>';
    }).join('');

    Array.prototype.forEach.call(grid.querySelectorAll('[data-add]'), function (b) {
      b.addEventListener('click', function () { agregar(b.getAttribute('data-add')); });
    });
  }

  /* ---------- carrito ---------- */
  function agregar(sku) {
    var l = carrito.find(function (x) { return x.sku === sku; });
    if (l) l.cantidad += 1; else carrito.push({ sku: sku, cantidad: 1 });
    pintarCarrito();
    pulso();                       // no abrimos el cajón: molesta al agregar varios
  }
  function cambiar(sku, d) {
    var l = carrito.find(function (x) { return x.sku === sku; });
    if (!l) return;
    l.cantidad += d;
    if (l.cantidad < 1) carrito = carrito.filter(function (x) { return x.sku !== sku; });
    pintarCarrito();
  }
  function quitar(sku) {
    carrito = carrito.filter(function (x) { return x.sku !== sku; });
    pintarCarrito();
  }

  function pintarCarrito() {
    var badge = $('#vf-count');
    if (badge) {
      var u = totalUnidades();
      badge.textContent = u;
      badge.hidden = u === 0;
    }
    var body = $('#vf-lineas');
    if (!body) return;

    if (!carrito.length) {
      body.innerHTML = '<p class="note" style="padding:28px 0">Tu pedido está vacío. Agrega productos del catálogo y los enviamos juntos por WhatsApp.</p>';
    } else {
      body.innerHTML = carrito.map(function (l) {
        var p = porSku(l.sku);
        if (!p) return '';
        var sub = p.precio !== null ? soles(p.precio * l.cantidad) : 'A cotizar';
        return '<div class="line">' +
          '<div class="nm">' + p.nombre + '<div class="sku" style="margin-top:4px">' + p.sku + '</div></div>' +
          '<div class="pr">' + sub + '</div>' +
          '<div class="qty">' +
            '<button type="button" data-menos="' + p.sku + '" aria-label="Quitar uno">−</button>' +
            '<span>' + l.cantidad + '</span>' +
            '<button type="button" data-mas="' + p.sku + '" aria-label="Agregar uno">+</button>' +
          '</div>' +
          '<button type="button" class="rm" data-rm="' + p.sku + '">Quitar</button>' +
        '</div>';
      }).join('');

      Array.prototype.forEach.call(body.querySelectorAll('[data-mas]'), function (b) {
        b.addEventListener('click', function () { cambiar(b.getAttribute('data-mas'), 1); });
      });
      Array.prototype.forEach.call(body.querySelectorAll('[data-menos]'), function (b) {
        b.addEventListener('click', function () { cambiar(b.getAttribute('data-menos'), -1); });
      });
      Array.prototype.forEach.call(body.querySelectorAll('[data-rm]'), function (b) {
        b.addEventListener('click', function () { quitar(b.getAttribute('data-rm')); });
      });
    }

    var tv = $('#vf-total');
    if (tv) tv.textContent = soles(totalSoles());
    var av = $('#vf-aviso');
    if (av) av.hidden = !hayPendientes();
    var cta = $('#vf-enviar');
    if (cta) cta.toggleAttribute('disabled', carrito.length === 0);
  }

  function pulso() {
    var b = $('#vf-abrir');
    if (!b) return;
    b.classList.remove('pulse');
    void b.offsetWidth;
    b.classList.add('pulse');
  }

  /* ---------- cajón ---------- */
  function abrirCarrito() { var d = $('#vf-drawer'); if (d) { d.setAttribute('open', ''); document.body.style.overflow = 'hidden'; } }
  function cerrarCarrito() { var d = $('#vf-drawer'); if (d) { d.removeAttribute('open'); document.body.style.overflow = ''; } }

  /* ---------- checkout por WhatsApp ---------- */
  function mensaje() {
    var l = ['Hola Villa Fresh, quiero hacer este pedido:', ''];
    carrito.forEach(function (x) {
      var p = porSku(x.sku);
      if (!p) return;
      l.push('• ' + x.cantidad + ' x ' + p.nombre + ' (' + p.sku + ')' +
             (p.precio !== null ? ' — ' + soles(p.precio * x.cantidad) : ' — a cotizar'));
    });
    l.push('');
    if (totalSoles() > 0) l.push('Total de lo que tiene precio: ' + soles(totalSoles()));
    if (hayPendientes()) l.push('Hay productos que necesito que me coticen.');
    l.push('', 'Mi dirección: ', 'Distrito: ');
    return l.join('\n');
  }
  function enviar() {
    if (!carrito.length) return;
    window.open('https://wa.me/' + telefono + '?text=' + encodeURIComponent(mensaje()), '_blank', 'noopener');
  }

  /* ---------- arranque ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    pintarFiltros();
    pintarGrilla();
    pintarCarrito();

    var abrir = $('#vf-abrir');   if (abrir)  abrir.addEventListener('click', abrirCarrito);
    var cerr  = $('#vf-cerrar');  if (cerr)   cerr.addEventListener('click', cerrarCarrito);
    var veil  = $('#vf-veil');    if (veil)   veil.addEventListener('click', cerrarCarrito);
    var env   = $('#vf-enviar');  if (env)    env.addEventListener('click', enviar);
    var limp  = $('#vf-limpiar'); if (limp)   limp.addEventListener('click', function () { carrito = []; pintarCarrito(); });

    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrarCarrito(); });
  });
})();
