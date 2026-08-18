document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    const preloaderBar = document.getElementById('preloader-bar');
    const preloaderCounter = document.getElementById('preloader-counter');

    if (preloader && preloaderBar && preloaderCounter) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 20) + 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
            }
            preloaderBar.style.width = progress + '%';
            preloaderCounter.innerText = progress + '%';
        }, 30);

        const removePreloader = () => {
            clearInterval(interval);
            preloaderBar.style.width = '100%';
            preloaderCounter.innerText = '100%';
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => preloader.remove(), 700);
            }, 200);
        };

        if (document.readyState === 'complete') {
            removePreloader();
        } else {
            window.addEventListener('load', removePreloader);
        }
    }

    const canvas = document.getElementById('shader-canvas-ANIMATION_1');
    if (canvas) {
        function syncSize() {
            const w = canvas.clientWidth || window.innerWidth;
            const h = canvas.clientHeight || window.innerHeight;
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w;
                canvas.height = h;
            }
        }
        if (typeof ResizeObserver !== 'undefined') new ResizeObserver(syncSize).observe(canvas);
        syncSize();

        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
            const vs = `attribute vec2 a_position; varying vec2 v_texCoord; void main() { v_texCoord = a_position * 0.5 + 0.5; gl_Position = vec4(a_position, 0.0, 1.0); }`;
            const fs = `precision mediump float; varying vec2 v_texCoord; uniform float u_time; uniform vec2 u_resolution; float noise(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); } void main() { vec2 uv = v_texCoord; float n = noise(uv * u_resolution.xy + u_time * 0.0005); vec3 baseColor = vec3(0.957, 0.957, 0.961); float grad = 1.0 - length(uv - vec2(0.0)) * 0.15; vec3 color = baseColor * grad; color += (n - 0.5) * 0.015; gl_FragColor = vec4(color, 1.0); }`;
            
            function cs(type, src) {
                const s = gl.createShader(type);
                gl.shaderSource(s, src);
                gl.compileShader(s);
                return s;
            }
            
            const prog = gl.createProgram();
            gl.attachShader(prog, cs(gl.VERTEX_SHADER, vs));
            gl.attachShader(prog, cs(gl.FRAGMENT_SHADER, fs));
            gl.linkProgram(prog);
            gl.useProgram(prog);
            
            const buf = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buf);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
            
            const pos = gl.getAttribLocation(prog, 'a_position');
            gl.enableVertexAttribArray(pos);
            gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
            
            const uTime = gl.getUniformLocation(prog, 'u_time');
            const uRes = gl.getUniformLocation(prog, 'u_resolution');
            
            function render(t) {
                if (typeof ResizeObserver === 'undefined') syncSize();
                gl.viewport(0, 0, canvas.width, canvas.height);
                if (uTime) gl.uniform1f(uTime, t * 0.001);
                if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
                requestAnimationFrame(render);
            }
            
            setTimeout(() => requestAnimationFrame(render), 1500);
        }
    }

    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
    const cursor = document.getElementById('custom-cursor');
    
    if (cursor && !isTouchDevice) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
        });

        const interactiveElements = document.querySelectorAll('a, button, .magnetic-element');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
        });
    } else if (cursor) {
        cursor.style.display = 'none';
    }

    if (!isTouchDevice) {
        const magneticElements = document.querySelectorAll('[data-magnetic]');
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                this.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
                this.classList.remove('magnetic'); 
            });

            el.addEventListener('mouseleave', function() {
                this.classList.add('magnetic'); 
                this.style.transform = 'translate(0px, 0px)';
            });
        });
    }

    const revealElements = document.querySelectorAll('.reveal-up');
    const revealOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    
    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);
    revealElements.forEach(el => revealOnScroll.observe(el));

    const toggleBtn = document.getElementById('toggle-certs');
    const hiddenCerts = document.querySelectorAll('.hidden-cert');
    
    if(toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            let isHidden = false;
            hiddenCerts.forEach(cert => {
                cert.classList.toggle('hidden');
                if(cert.classList.contains('hidden')) isHidden = true;
            });
            if(!isHidden) {
                toggleBtn.innerText = "SHOW LESS";
            } else {
                toggleBtn.innerText = "SHOW ALL CREDENTIALS";
                document.getElementById('credentials').scrollIntoView({behavior: 'smooth'});
            }
        });
    }

    const sections = document.querySelectorAll('section[id], footer[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 150)) current = section.getAttribute('id');
        });

        navLinks.forEach(link => {
            link.classList.remove('text-vermilion', 'border-vermilion', 'opacity-100');
            link.classList.add('opacity-80', 'border-transparent');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('text-vermilion', 'border-vermilion', 'opacity-100');
                link.classList.remove('opacity-80', 'border-transparent');
            }
        });
    });
});