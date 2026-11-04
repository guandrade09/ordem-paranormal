#!/usr/bin/env python3
"""Gera os fundos SVG das fichas de criaturas (img/bg-*.svg). Uso: python3 tools/gen-fundos.py
Tudo é procedural e determinístico (semente fixa): rode de novo para regenerar após ajustar os parâmetros."""
import math, random, os

W, H = 900, 1600
OUT = os.path.join(os.path.dirname(__file__), '..', 'img')


def f(x):
    return ('%.1f' % x).rstrip('0').rstrip('.')


def svg(body, defs=''):
    return ("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 %d %d' preserveAspectRatio='xMidYMid slice'>"
            "<defs>%s</defs>%s</svg>" % (W, H, defs, body))


# ---------------------------------------------------------------- GLIFOS
def glyph_path(rng, x, y):
    """Um 'caractere' ilegível desenhado com traços aleatórios numa caixa de ~8x13."""
    d = ''
    for _ in range(rng.randint(2, 4)):
        k = rng.randint(0, 5)
        if k == 0:
            xx = x + rng.uniform(1, 7); d += 'M%s %sl%s %s' % (f(xx), f(y), f(rng.uniform(-1.5, 1.5)), f(rng.uniform(8, 13)))
        elif k == 1:
            d += 'M%s %sl%s %s' % (f(x + rng.uniform(0, 2)), f(y + rng.uniform(0, 6)), f(rng.uniform(4, 7)), f(rng.uniform(3, 9)))
        elif k == 2:
            d += 'M%s %sq%s %s %s %s' % (f(x), f(y + rng.uniform(2, 9)), f(rng.uniform(2, 5)), f(rng.uniform(-6, 0)), f(rng.uniform(5, 8)), f(rng.uniform(-1, 3)))
        elif k == 3:
            d += 'M%s %sl%s 0' % (f(x + rng.uniform(0, 2)), f(y + rng.uniform(1, 11)), f(rng.uniform(3, 7)))
        elif k == 4:
            cx, cy = x + rng.uniform(2, 5), y + rng.uniform(3, 9)
            d += 'M%s %sa2 2.4 0 1 0 .1 0' % (f(cx), f(cy))
        else:
            d += 'M%s %sl.1 .1' % (f(x + rng.uniform(1, 7)), f(y + rng.uniform(0, 12)))
    return d



# ---------------------------------------------------------------- FUNDOS (um símbolo do elemento no centro)
# Inspirados nas referências do usuário. Valem para todas as criaturas do elemento.
def symuri(nome, size=300):
    """Símbolo oficial (img/sym-*.png, branco) reduzido e embutido em base64 (SVG usado como fundo não carrega arquivos externos)."""
    import base64, io
    from PIL import Image
    im = Image.open(os.path.join(OUT, 'sym-%s.png' % nome)).convert('RGBA')
    im.thumbnail((size, size), Image.LANCZOS)
    b = io.BytesIO(); im.save(b, 'PNG', optimize=True)
    return 'data:image/png;base64,' + base64.b64encode(b.getvalue()).decode(), im.size


def symimg(nome, cx, cy, size, tint=None, opacity=1, glow=0):
    uri, (w, h) = symuri(nome, 360)
    k = size / max(w, h); w, h = w * k, h * k
    fl = " filter='url(#tint)'" if tint else ''
    out = ''
    if glow:
        out += "<image href='%s' x='%s' y='%s' width='%s' height='%s' filter='url(#%s)' opacity='%s'/>" % (uri, f(cx - w / 2), f(cy - h / 2), f(w), f(h), 'tglow' if tint else 'glow', glow)
    return out + "<image href='%s' x='%s' y='%s' width='%s' height='%s'%s opacity='%s'/>" % (uri, f(cx - w / 2), f(cy - h / 2), f(w), f(h), fl, opacity)


def tintdefs(rgb):
    return ("<filter id='tint' color-interpolation-filters='sRGB'><feColorMatrix values='0 0 0 0 %s 0 0 0 0 %s 0 0 0 0 %s 0 0 0 1 0'/></filter>"
            "<filter id='glow' x='-40%%' y='-40%%' width='180%%' height='180%%'><feGaussianBlur stdDeviation='14'/></filter>"
            "<filter id='tglow' color-interpolation-filters='sRGB' x='-40%%' y='-40%%' width='180%%' height='180%%'><feColorMatrix values='0 0 0 0 %s 0 0 0 0 %s 0 0 0 0 %s 0 0 0 1 0'/><feGaussianBlur stdDeviation='14'/></filter>" % (tuple(rgb.split()) * 2))


def smooth(pts, close=False):
    """Caminho suave por quadráticas passando pelos pontos médios."""
    if close:
        d = 'M%s %s' % (f((pts[-1][0] + pts[0][0]) / 2), f((pts[-1][1] + pts[0][1]) / 2))
        for i in range(len(pts)):
            p, q = pts[i], pts[(i + 1) % len(pts)]
            d += 'Q%s %s %s %s' % (f(p[0]), f(p[1]), f((p[0] + q[0]) / 2), f((p[1] + q[1]) / 2))
        return d + 'Z'
    d = 'M%s %s' % (f(pts[0][0]), f(pts[0][1]))
    for i in range(1, len(pts) - 1):
        p, q = pts[i], pts[i + 1]
        d += 'Q%s %s %s %s' % (f(p[0]), f(p[1]), f((p[0] + q[0]) / 2), f((p[1] + q[1]) / 2))
    return d + 'L%s %s' % (f(pts[-1][0]), f(pts[-1][1]))


def morte():
    """Preto com poeira, símbolo de Morte brilhando no centro e espirais/círculos de giz na parte de baixo (referência do usuário)."""
    rng = random.Random(106)
    defs = tintdefs('.86 .86 .86') + ("<filter id='ch' x='-10%' y='-10%' width='120%' height='120%'><feTurbulence type='fractalNoise' baseFrequency='.03' numOctaves='2' seed='6' result='n'/>"
                                       "<feDisplacementMap in='SourceGraphic' in2='n' scale='9'/></filter>"
                                       "<filter id='gr' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' seed='2'/>"
                                       "<feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 1.5 0 0 0 -.8'/></filter>"
                                       "<filter id='bl' x='-50%' y='-50%' width='200%' height='200%'><feGaussianBlur stdDeviation='2.2'/></filter>"
                                       "<radialGradient id='v' cx='50%' cy='42%' r='75%'><stop offset='.4' stop-color='#000' stop-opacity='0'/>"
                                       "<stop offset='1' stop-color='#000' stop-opacity='.6'/></radialGradient>")
    o = "<rect width='%d' height='%d' fill='#0c0c0c'/><rect width='%d' height='%d' filter='url(#gr)' opacity='.1'/>" % (W, H, W, H)
    # poeira
    for i in range(170):
        r = rng.choice([.8, .9, 1, 1.2, 1.5, 2.2]); op = rng.uniform(.12, .5)
        o += "<circle cx='%s' cy='%s' r='%s' fill='#fff' fill-opacity='%s'%s/>" % (f(rng.uniform(0, W)), f(rng.uniform(0, H * .85)), f(r), f(op), " filter='url(#bl)'" if r > 1.4 else '')
    # espirais e círculos de giz (parte de baixo)
    def giz(cx, cy, r0, r1, turns, op, passes=3):
        out = ''
        for k in range(passes):
            ph = rng.uniform(0, 6.28); n = int(turns * 36); pts = []
            for i in range(n + 1):
                t = i / n; a = ph + t * turns * 2 * math.pi
                rr = r0 + (r1 - r0) * t + rng.uniform(-3, 3) + 4 * math.sin(t * 17 + k)
                pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a) * .92))
            out += "<path d='%s' fill='none' stroke='#9a9a9a' stroke-opacity='%s' stroke-width='%s' stroke-linecap='round'/>" % (smooth(pts), f(op * rng.uniform(.6, 1)), f(rng.uniform(1.4, 3.4)))
        return out
    g = ''
    g += giz(330, 1400, 18, 300, 4.2, .55, 3)              # espiral grande embaixo
    g += giz(120, 1130, 40, 250, 2.4, .4, 3)                # esquerda
    g += giz(800, 1180, 40, 280, 2.2, .4, 3)                # direita
    g += giz(660, 1500, 60, 330, 2.6, .35, 3)
    g += giz(40, 1560, 30, 260, 2.2, .35, 2)
    for i in range(7):                                      # círculos soltos
        cx, cy = rng.uniform(0, W), rng.uniform(1000, 1650)
        g += giz(cx, cy, rng.uniform(70, 150), rng.uniform(75, 160), 1.05, .32, 2)
    for i in range(26):                                     # runas minúsculas ao longo dos traços
        x, y = rng.uniform(0, W), rng.uniform(1050, 1620)
        g += "<path transform='translate(%s %s) rotate(%s)' d='%s' fill='none' stroke='#9a9a9a' stroke-opacity='.4' stroke-width='1.6' stroke-linecap='round'/>" % (f(x), f(y), f(rng.uniform(-50, 50)), glyph_path(rng, -4, -6))
    o += "<g filter='url(#ch)'>%s</g>" % g
    o += symimg('morte', 450, 760, 360, tint=True, opacity=.93, glow=.75)
    o += "<rect width='%d' height='%d' fill='url(#v)'/>" % (W, H)
    return svg(o, defs)


def conhecimento():
    rng = random.Random(102)
    defs = tintdefs('.93 .87 .7') + ("<radialGradient id='g' cx='50%' cy='48%' r='45%'><stop offset='0' stop-color='#7a6726' stop-opacity='.8'/>"
                                      "<stop offset='1' stop-color='#6b5b22' stop-opacity='0'/></radialGradient>"
                                      "<filter id='n' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' seed='4'/>"
                                      "<feColorMatrix values='0 0 0 0 1 0 0 0 0 .95 0 0 0 0 .8 1.4 0 0 0 -.62'/></filter>"
                                      "<radialGradient id='v' cx='50%' cy='50%' r='75%'><stop offset='.5' stop-color='#000' stop-opacity='0'/>"
                                      "<stop offset='1' stop-color='#000' stop-opacity='.6'/></radialGradient>")
    cx, cy = 450, 790
    o = "<rect width='%d' height='%d' fill='#0d0b08'/><rect width='%d' height='%d' fill='url(#g)'/>" % (W, H, W, H)
    o += "<rect width='%d' height='%d' filter='url(#n)' opacity='.35'/>" % (W, H)

    def glyph(x, y, sc, rot, op, w=1.4):
        return ("<path transform='translate(%s %s) rotate(%s) scale(%s)' d='%s' fill='none' stroke='#efe6cf' stroke-opacity='%s' stroke-width='%s' stroke-linecap='round'/>"
                % (f(x), f(y), f(rot), f(sc), glyph_path(rng, -4, -6), f(op), f(w / sc)))
    for i in range(150):                                  # glifos espalhados, apagados
        o += glyph(rng.uniform(10, W - 10), rng.uniform(10, H - 10), rng.uniform(2.0, 3.6), rng.uniform(-40, 40), rng.uniform(.14, .32), 1.8)
    for i in range(115):                                  # espiral de glifos brilhantes ao redor do símbolo
        t = i / 115; ang = t * 5.2 * 2 * math.pi; r = 50 + 300 * t ** .85
        o += glyph(cx + r * math.cos(ang), cy + r * math.sin(ang), .9 + 2.2 * t ** .7, math.degrees(ang) + 90, .6 + .4 * (1 - t), 2.2)
    # linhas fluidas
    for k in range(6):
        x0, y0 = rng.choice([(-20, rng.uniform(0, 500)), (W + 20, rng.uniform(300, 900)), (rng.uniform(0, W), -20), (rng.uniform(0, W), H + 20)])
        x1, y1 = rng.uniform(100, 800), rng.uniform(300, 1300)
        for j in range(2):
            off = j * 7
            o += ("<path d='M%s %sC%s %s %s %s %s %s' fill='none' stroke='#e9e3d0' stroke-opacity='%s' stroke-width='%s' stroke-linecap='round'/>"
                  % (f(x0 + off), f(y0), f(rng.uniform(0, W)), f(rng.uniform(0, H)), f(rng.uniform(0, W)), f(rng.uniform(0, H)), f(x1 + off), f(y1), f(.6 - j * .2), f(4.2 - j * 1.8)))
    o += symimg('conhecimento', cx, cy, 190, glow=.7)
    o += ("<text x='450' y='1390' text-anchor='middle' font-family=\"'Segoe Script','Brush Script MT','Snell Roundhand',cursive\" font-style='italic' "
          "font-size='32' fill='#d9d2bb' fill-opacity='.6'>saber tudo é perder tudo.</text>")
    o += "<rect width='%d' height='%d' fill='#000' fill-opacity='.22'/><rect width='%d' height='%d' fill='url(#v)'/>" % (W, H, W, H)
    return svg(o, defs)


def vein(rng, x, y, ang, L, depth=0):
    """Veia sinuosa: lista de pontos + ramificações."""
    pts = [(x, y)]; a = ang; out = []
    for i in range(int(L / 30)):
        a += rng.uniform(-.2, .2) - (a - ang) * .22
        x += 30 * math.cos(a); y += 30 * math.sin(a); pts.append((x, y))
        if depth < 2 and i > 5 and rng.random() < .1:
            out += vein(rng, x, y, a + rng.choice([-1, 1]) * rng.uniform(.5, 1.1), L * rng.uniform(.3, .5), depth + 1)
    return [pts] + out


def energia():
    rng = random.Random(103)
    defs = tintdefs('1 .42 .88') + ("<linearGradient id='b' x1='0' y1='0' x2='.5' y2='1'><stop offset='0' stop-color='#3a0f6c'/><stop offset='.5' stop-color='#6a29b0'/>"
                                     "<stop offset='1' stop-color='#42167c'/></linearGradient>"
                                     "<filter id='t' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='.012 .02' numOctaves='4' seed='3'/>"
                                     "<feColorMatrix values='0 0 0 0 .85 0 0 0 0 .55 0 0 0 0 1 1.3 0 0 0 -.4'/></filter>"
                                     "<filter id='g2' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' seed='9'/>"
                                     "<feColorMatrix values='0 0 0 0 1 0 0 0 0 .9 0 0 0 0 1 1.6 0 0 0 -.8'/></filter>"
                                     "<filter id='bl' x='-20%' y='-20%' width='140%' height='140%'><feGaussianBlur stdDeviation='5'/></filter>"
                                     "<radialGradient id='v' cx='50%' cy='50%' r='75%'><stop offset='.5' stop-color='#000' stop-opacity='0'/>"
                                     "<stop offset='1' stop-color='#000' stop-opacity='.55'/></radialGradient>")
    o = "<rect width='%d' height='%d' fill='url(#b)'/><rect width='%d' height='%d' filter='url(#t)' opacity='.4'/>" % (W, H, W, H)
    o += "<rect width='%d' height='%d' filter='url(#g2)' opacity='.5'/>" % (W, H)
    for k in range(3):                                    # faixas de luz diagonais
        o += "<polygon points='%s' fill='#fff' fill-opacity='.05'/>" % ' '.join('%s,%s' % (f(x), f(y)) for x, y in [(rng.uniform(-300, 300), 0), (rng.uniform(400, 700), 0), (W + 200, rng.uniform(500, 900)), (W + 200, rng.uniform(1000, 1400))])
    cols = ['#ff7ad9', '#e667ff', '#7f9bff', '#ff9be8']
    glow = ''; core = ''
    starts = [(60 + i * 150 + rng.uniform(-40, 40), -20, math.pi / 2 + rng.uniform(-.28, .28)) for i in range(6)] + \
             [(rng.uniform(100, 800), H + 20, -math.pi / 2 + rng.uniform(-.3, .3)) for _ in range(3)]
    for sx, sy, sa in starts:
        for pts in vein(rng, sx, sy, sa, rng.uniform(1100, 1700)):
            nstr = rng.randint(4, 8); col = rng.choice(cols)
            for j in range(nstr):
                off = (j - nstr / 2) * rng.uniform(2, 3.6)
                q = [(x + off * math.sin(0 + i * .07 + j), y + off * math.cos(i * .07 + j)) for i, (x, y) in enumerate(pts)]
                w = (3.6 if j == nstr // 2 else rng.uniform(.8, 1.8))
                core += "<path d='%s' fill='none' stroke='%s' stroke-opacity='%s' stroke-width='%s' stroke-linecap='round'/>" % (smooth(q), col if j % 3 else '#8aa2ff', f(rng.uniform(.6, .95)), f(w))
            glow += "<path d='%s' fill='none' stroke='%s' stroke-opacity='.45' stroke-width='9'/>" % (smooth(pts), col)
    o += "<g filter='url(#bl)'>%s</g>%s" % (glow, core)
    o += "<rect width='%d' height='%d' fill='#000' fill-opacity='.2'/>" % (W, H)
    o += symimg('energia', 450, 800, 210, tint=True, opacity=.95, glow=.8)
    o += "<rect width='%d' height='%d' fill='url(#v)'/>" % (W, H)
    return svg(o, defs)


def sangue():
    """Mármore vermelho-escuro (como a referência) com o símbolo de Sangue em vermelho vivo no centro."""
    defs = tintdefs('.9 .1 .14') + ("<filter id='m1' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='.004 .006' numOctaves='5' seed='12'/>"
                                     "<feColorMatrix values='0 0 0 0 .78 0 0 0 0 .12 0 0 0 0 .14 1.9 0 0 0 -.62'/></filter>"
                                     "<filter id='m2' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='.035 .05' numOctaves='4' seed='5'/>"
                                     "<feColorMatrix values='0 0 0 0 .02 0 0 0 0 0 0 0 0 0 0 -2.2 0 0 0 1.35'/></filter>"
                                     "<filter id='m3' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='.18' numOctaves='2' seed='21'/>"
                                     "<feColorMatrix values='0 0 0 0 1 0 0 0 0 .3 0 0 0 0 .3 2.4 0 0 0 -1.35'/></filter>"
                                     "<radialGradient id='v' cx='50%' cy='50%' r='75%'><stop offset='.45' stop-color='#000' stop-opacity='0'/>"
                                     "<stop offset='1' stop-color='#000' stop-opacity='.6'/></radialGradient>")
    o = "<rect width='%d' height='%d' fill='#1d0406'/>" % (W, H)
    o += "<rect width='%d' height='%d' filter='url(#m1)' opacity='.5'/>" % (W, H)
    o += "<rect width='%d' height='%d' filter='url(#m2)' opacity='.4'/>" % (W, H)
    o += "<rect width='%d' height='%d' filter='url(#m3)' opacity='.1'/>" % (W, H)
    o += "<rect width='%d' height='%d' fill='#000' fill-opacity='.18'/>" % (W, H)
    o += symimg('sangue', 450, 800, 230, tint=True, opacity=1, glow=.7)
    o += "<rect width='%d' height='%d' fill='url(#v)'/>" % (W, H)
    return svg(o, defs)


def medo():
    """Pedra escura e fumaça fraca (como a referência) com o símbolo de Medo em preto no centro."""
    rng = random.Random(105)
    defs = tintdefs('.02 .02 .02') + ("<filter id='rim' color-interpolation-filters='sRGB'><feColorMatrix values='0 0 0 0 .42 0 0 0 0 .42 0 0 0 0 .42 0 0 0 1 0'/></filter>"
                                       "<filter id='r1' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='.01 .014' numOctaves='5' seed='31'/>"
                                       "<feColorMatrix values='0 0 0 0 .62 0 0 0 0 .62 0 0 0 0 .62 1.6 0 0 0 -.62'/></filter>"
                                       "<filter id='r2' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='.06 .09' numOctaves='3' seed='8'/>"
                                       "<feColorMatrix values='0 0 0 0 .8 0 0 0 0 .8 0 0 0 0 .8 3 0 0 0 -1.95'/></filter>"
                                       "<filter id='sm' x='-20%' y='-20%' width='140%' height='140%'><feGaussianBlur stdDeviation='9'/></filter>"
                                       "<radialGradient id='v' cx='50%' cy='50%' r='75%'><stop offset='.45' stop-color='#000' stop-opacity='0'/>"
                                       "<stop offset='1' stop-color='#000' stop-opacity='.65'/></radialGradient>")
    o = "<rect width='%d' height='%d' fill='#1b1b1b'/>" % (W, H)
    o += "<rect width='%d' height='%d' filter='url(#r1)' opacity='.28'/>" % (W, H)
    o += "<rect width='%d' height='%d' filter='url(#r2)' opacity='.16'/>" % (W, H)
    o += "<g filter='url(#sm)' fill='none' stroke='#fff' stroke-linecap='round'>"
    for i in range(9):                                    # fumaça fina subindo ao redor do símbolo
        x = 450 + rng.uniform(-230, 230); y = 1180
        pts = [(x, y)]
        for k in range(8):
            x += rng.uniform(-60, 60); y -= rng.uniform(95, 135); pts.append((x, y))
        o += "<path d='%s' stroke-opacity='%s' stroke-width='%s'/>" % (smooth(pts), f(rng.uniform(.05, .11)), f(rng.uniform(6, 16)))
    o += "</g>"
    uri, (iw, ih) = symuri('medo', 360)
    k = 330 / max(iw, ih); iw, ih = iw * k, ih * k
    o += ("<image href='%s' x='%s' y='%s' width='%s' height='%s' filter='url(#rim)' opacity='.55'/>"      # borda clara (relevo)
          % (uri, f(450 - iw / 2 - 3), f(760 - ih / 2 - 3), f(iw), f(ih)))
    o += symimg('medo', 450, 760, 330, tint=True, opacity=.97, glow=.22)
    o += "<rect width='%d' height='%d' fill='url(#v)'/>" % (W, H)
    return svg(o, defs)


if __name__ == '__main__':
    for nome, fn in [('sangue', sangue), ('morte', morte), ('conhecimento', conhecimento), ('energia', energia), ('medo', medo)]:
        s = fn()
        open(os.path.join(OUT, 'bg-%s.svg' % nome), 'w').write(s)
        print(nome, len(s) // 1024, 'KB')
