class FPSMeter {
    constructor() {
        this.frame_time = 0
        this.last_loop = 0
        this.current_loop = 0
        this.fps = 0
    }

    get value() {
        return this.fps
    }

    run() {
        this.current_loop = performance.now()
        this.frame_time += ((this.current_loop - this.last_loop) - this.frame_time) / 20
        this.last_loop = this.current_loop
        this.fps = (1000 / this.frame_time).toFixed(1)
    }
}

function rgba_to_uint32(r, g, b, a) {
    return a % 256 << 24 | b % 256 << 16 | g % 256 << 8 | r % 256
}

function hexrgb_to_uint32(hex) {
    return 255 << 24 | parseInt(hex, 16)
}

function hexabgr_to_uint32(hex) {
    return parseInt(hex, 16)
}

class Palette {
    constructor(rgba_array) {
        this.set_colors(rgba_array)
    }

    set_colors(rgba_array) {
        this.colors = rgba_array
        this.num_colors = this.colors.length
        return this
    }

    color(index) {
        return this.colors[index % this.num_colors]
    }

    add_colors(src) {
        this.set_colors(this.colors.concat(src.colors))
        return this
    }

    static from_predefined(name) {
        var predefined = {
            bw: ['000000', 'ffffff'],
            cga1: ['000000', 'aa00aa', '00aaaa', 'aaaaaa'],
            cga2: ['000000', 'aa0000', '00aa00', 'aa5500'],
            cga16: [
                '000000', '0000aa', '00aa00', '00aaaa',
                'aa0000', 'aa00aa', 'aa5500', 'aaaaaa',
                '555555', '5555ff', '55ff55', '55ffff',
                'ff5555', 'ff55ff', 'ffff55', 'ffffff',
            ],
            vga256: [
                '000000', '0000aa', '00aa00', '00aaaa',
                'aa0000', 'aa00aa', 'aa5500', 'aaaaaa',
                '555555', '5555ff', '55ff55', '55ffff',
                'ff5555', 'ff55ff', 'ffff55', 'ffffff',
                '000000', '101010', '202020', '353535',
                '454545', '555555', '656565', '757575',
                '8a8a8a', '9a9a9a', 'aaaaaa', 'bababa',
                'cacaca', 'dfdfdf', 'efefef', 'ffffff',
                '0000ff', '4100ff', '8200ff', 'be00ff',
                'ff00ff', 'ff00be', 'ff0082', 'ff0041',
                'ff0000', 'ff4100', 'ff8200', 'ffbe00',
                'ffff00', 'beff00', '82ff00', '41ff00',
                '00ff00', '00ff41', '00ff82', '00ffbe',
                '00ffff', '00beff', '0082ff', '0041ff',
                '8282ff', '9e82ff', 'be82ff', 'df82ff',
                'ff82ff', 'ff82df', 'ff82be', 'ff829e',
                'ff8282', 'ff9e82', 'ffbe82', 'ffdf82',
                'ffff82', 'dfff82', 'beff82', '9eff82',
                '82ff82', '82ff9e', '82ffbe', '82ffdf',
                '82ffff', '82dfff', '82beff', '829eff',
                'babaff', 'cabaff', 'dfbaff', 'efbaff',
                'ffbaff', 'ffbaef', 'ffbadf', 'ffbaca',
                'ffbaba', 'ffcaba', 'ffdfba', 'ffefba',
                'ffffba', 'efffba', 'dfffba', 'caffba',
                'baffba', 'baffca', 'baffdf', 'baffef',
                'baffff', 'baefff', 'badfff', 'bacaff',
                '000071', '1c0071', '390071', '550071',
                '710071', '710055', '710039', '71001c',
                '710000', '711c00', '713900', '715500',
                '717100', '557100', '397100', '1c7100',
                '007100', '00711c', '007139', '007155',
                '007171', '005571', '003971', '001c71',
                '393971', '453971', '553971', '613971',
                '713971', '713961', '713955', '713945',
                '713939', '714539', '715539', '716139',
                '717139', '617139', '557139', '457139',
                '397139', '397145', '397155', '397161',
                '397171', '396171', '395571', '394571',
                '515171', '595171', '615171', '695171',
                '715171', '715169', '715161', '715159',
                '715151', '715951', '716151', '716951',
                '717151', '697151', '617151', '597151',
                '517151', '517159', '517161', '517169',
                '517171', '516971', '516171', '515971',
                '000041', '100041', '200041', '310041',
                '410041', '410031', '410020', '410010',
                '410000', '411000', '412000', '413100',
                '414100', '314100', '204100', '104100',
                '004100', '004110', '004120', '004131',
                '004141', '003141', '002041', '001041',
                '202041', '282041', '312041', '392041',
                '412041', '412039', '412031', '412028',
                '412020', '412820', '413120', '413920',
                '414120', '394120', '314120', '284120',
                '204120', '204128', '204131', '204139',
                '204141', '203941', '203141', '202841',
                '2d2d41', '312d41', '352d41', '3d2d41',
                '412d41', '412d3d', '412d35', '412d31',
                '412d2d', '41312d', '41352d', '413d2d',
                '41412d', '3d412d', '35412d', '31412d',
                '2d412d', '2d4131', '2d4135', '2d413d',
                '2d4141', '2d3d41', '2d3541', '2d3141',
                '000000', '000000', '000000', '000000',
                '000000', '000000', '000000', '000000',
            ]
        }
        return Palette.from_hex_array(predefined[name])
    }

    static gradient(r1, g1, b1, r2, g2, b2, steps) {
        var tmp = []
        for (var i=0; i<steps; i++) {
            r1 + ((r2 - r1) / steps) * i
            tmp.push(rgba_to_uint32(
                r1 + ((r2 - r1) / steps) * i,
                g1 + ((g2 - g1) / steps) * i,
                b1 + ((b2 - b1) / steps) * i,
                255
            ))
        }
        return new Palette(tmp)
    }

    static from_hex_array(hex_array) {
        var tmp = []
        for (var i = 0; i < hex_array.length; i++) {
            tmp.push(hexrgb_to_uint32(hex_array[i]))
        }
        return new Palette(tmp)
    }
}


class Screen {
    constructor(width, height, palette, render_callback, supersample = 1) {
        this.canvas_width = width
        this.canvas_height = height
        this.width = width * supersample
        this.height = height * supersample
        this.palette = palette

        this.render_callback = render_callback
        this.render_callback.bind(this)

        this.canvas = document.createElement('canvas')
        document.body.appendChild(this.canvas)
        this.canvas.width = this.canvas_width
        this.canvas.height = this.canvas_height

        var styles = document.createElement('style');
        styles.innerHTML = `
            html {
                width: 100%;
                height: 100%;
                background: #333;
                box-shadow: inset 0 0 150px rgba(0, 0, 0, 0.5);
            }

            canvas {
                border: 1px solid #111;
                transform: scale(4, 4);
                image-rendering: pixelated;
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                margin: auto;
                max-width: 100%;
                max-height: 100%;
                overflow: auto;
                box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
            }
        `
        document.head.appendChild(styles);

        this.ctx = this.canvas.getContext('2d')
        this.img = this.ctx.getImageData(0, 0, this.width, this.height)

        this.screen_buffer_rgba = new ArrayBuffer(this.width * this.height * 4)
        this.screen_buffer_rgba8 = new Uint8ClampedArray(this.screen_buffer_rgba)
        this.screen_rgba = new Uint32Array(this.screen_buffer_rgba)

        this.screen_buffer = new ArrayBuffer(this.width * this.height * 4)
        this.screen_buffer8 = new Uint8ClampedArray(this.screen_buffer)
        this.screen = new Uint32Array(this.screen_buffer)

        this.frame_number = 0
        this.fps_meter = new FPSMeter()
        this.run()
    }

    run() {
        requestAnimationFrame(this.run.bind(this))
        this.ctx.save()

        this.render_callback(this)

        if (this.palette == null) {
            this.img.data.set(screen_buffer8)
        } else {
            for (var y = 0; y < this.height; ++y) {
                for (var x = 0; x < this.width; ++x) {
                    this.screen_rgba[y * this.width + x] = this.palette.color(this.screen[y * this.width + x])
                }
            }
            this.img.data.set(this.screen_buffer_rgba8)
        }
        createImageBitmap(this.img).then((imgBitmap) => {
            this.ctx.drawImage(imgBitmap, 0.49, 0.49, this.canvas_width, this.canvas_height)
        })
        this.ctx.restore()
        this.fps_meter.run()
        document.getElementById("fps").innerHTML = this.fps_meter.value
        this.frame_number++
    }
}
