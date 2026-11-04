#!/usr/bin/env python3
"""Gera os fundos SVG das fichas de criaturas (img/bg-*.svg). Uso: python3 tools/gen-fundos.py
Tudo é procedural e determinístico (semente fixa): rode de novo para regenerar após ajustar os parâmetros."""
import math, random, os

W, H = 900, 1600
OUT = os.path.join(os.path.dirname(__file__), '..', 'img')


def f(x):
    return ('%.1f' % x).rstrip('0').rstrip('.')


def blob(rng, cx, cy, r, n=11, j=.28):
    """Mancha irregular suave."""
    pts = []
    for i in range(n):
        a = i * 2 * math.pi / n
        rr = r * (1 - j + rng.random() * 2 * j)
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    d = 'M%s %s' % (f((pts[-1][0] + pts[0][0]) / 2), f((pts[-1][1] + pts[0][1]) / 2))
    for i in range(n):
        p, q = pts[i], pts[(i + 1) % n]
        d += 'Q%s %s %s %s' % (f(p[0]), f(p[1]), f((p[0] + q[0]) / 2), f((p[1] + q[1]) / 2))
    return d + 'Z'


def svg(body, defs=''):
    return ("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 %d %d' preserveAspectRatio='xMidYMid slice'>"
            "<defs>%s</defs>%s</svg>" % (W, H, defs, body))


# ---------------------------------------------------------------- SANGUE
def sangue():
    rng = random.Random(7)
    defs = ("<radialGradient id='b' cx='50%' cy='45%' r='75%'><stop offset='0' stop-color='#3a0a10'/>"
            "<stop offset='.6' stop-color='#260508'/><stop offset='1' stop-color='#100203'/></radialGradient>"
            "<radialGradient id='v' cx='50%' cy='50%' r='72%'><stop offset='.45' stop-color='#000' stop-opacity='0'/>"
            "<stop offset='1' stop-color='#000' stop-opacity='.6'/></radialGradient>")
    o = "<rect width='%d' height='%d' fill='url(#b)'/>" % (W, H)
    # pingos escorrendo do topo
    for i in range(6):
        x = rng.uniform(20, W - 20); w = rng.uniform(12, 28); L = rng.uniform(90, 380)
        o += ("<path d='M%s 0 L%s 0 L%s %s Q%s %s %s %s Z' fill='#4a050c' fill-opacity='.8'/>"
              % (f(x - w / 2), f(x + w / 2), f(x + w / 3), f(L), f(x), f(L + w), f(x - w / 3), f(L)))
        o += "<circle cx='%s' cy='%s' r='%s' fill='#4a050c' fill-opacity='.8'/>" % (f(x), f(L + w * .4), f(w * .55))
    # respingos: núcleo irregular + braços afilados terminando em gota + gotas satélite
    for i in range(9):
        cx = rng.uniform(0, W); cy = rng.uniform(0, H); r = rng.uniform(22, 72)
        col = rng.choice(['#52060d', '#5e070f', '#450509', '#6a0811'])
        arms = rng.randint(7, 12); ph = rng.uniform(0, 6.28)
        for k in range(arms):
            a = ph + k * 2 * math.pi / arms + rng.uniform(-.18, .18)
            L = r * rng.uniform(1.15, 2.3) * (1.7 if rng.random() < .2 else 1)
            w = r * rng.uniform(.28, .55)
            ca, sa = math.cos(a), math.sin(a)
            x1, y1 = cx + ca * r * .5, cy + sa * r * .5
            x2, y2 = cx + ca * L, cy + sa * L
            nx, ny = -sa, ca
            o += ("<path d='M%s %s Q%s %s %s %s Q%s %s %s %s Z' fill='%s' fill-opacity='.85'/>"
                  % (f(x1 + nx * w), f(y1 + ny * w), f((x1 + x2) / 2 + nx * w * .35), f((y1 + y2) / 2 + ny * w * .35), f(x2), f(y2),
                     f((x1 + x2) / 2 - nx * w * .35), f((y1 + y2) / 2 - ny * w * .35), f(x1 - nx * w), f(y1 - ny * w), col))
            if rng.random() < .75:
                o += "<circle cx='%s' cy='%s' r='%s' fill='%s' fill-opacity='.85'/>" % (f(cx + ca * (L + w * 1.4)), f(cy + sa * (L + w * 1.4)), f(w * rng.uniform(.5, 1.0)), col)
        o += "<path d='%s' fill='%s' fill-opacity='.9'/>" % (blob(rng, cx, cy, r * 1.05, 9, .2), col)
        o += "<path d='%s' fill='#8a0f18' fill-opacity='.22'/>" % blob(rng, cx - r * .2, cy - r * .2, r * .45, 7, .2)
        for k in range(rng.randint(6, 14)):
            a = rng.uniform(0, 2 * math.pi); d = r * rng.uniform(2.2, 5.5)
            o += "<circle cx='%s' cy='%s' r='%s' fill='%s' fill-opacity='.8'/>" % (f(cx + d * math.cos(a)), f(cy + d * math.sin(a)), f(rng.uniform(1.5, 6)), col)
    # gotas e borrifos pequenos
    for i in range(80):
        o += ("<circle cx='%s' cy='%s' r='%s' fill='#5a0710' fill-opacity='%s'/>"
              % (f(rng.uniform(0, W)), f(rng.uniform(0, H)), f(rng.uniform(.8, 4.2)), f(rng.uniform(.3, .75))))
    # gotas grandes caindo (forma de lágrima)
    for i in range(7):
        x = rng.uniform(30, W - 30); y = rng.uniform(60, H - 60); s = rng.uniform(7, 16)
        o += ("<path d='M%s %s Q%s %s %s %s Q%s %s %s %s Z' fill='#620810' fill-opacity='.7'/>"
              % (f(x), f(y - s * 2), f(x + s * 1.1), f(y - s * .2), f(x), f(y + s), f(x - s * 1.1), f(y - s * .2), f(x), f(y - s * 2)))
    o += "<rect width='%d' height='%d' fill='url(#v)'/>" % (W, H)
    return svg(o, defs)


# ---------------------------------------------------------------- MORTE
def spiral(cx, cy, r, turns, rot, cw):
    n = int(turns * 26)
    pts = []
    for i in range(n + 1):
        t = i / n
        a = rot + cw * t * turns * 2 * math.pi
        rr = r * t
        pts.append('%s,%s' % (f(cx + rr * math.cos(a)), f(cy + rr * math.sin(a))))
    return ' '.join(pts)


def morte():
    """Uma única espiral grande e grossa, cobrindo a tela, distorcida em alguns pontos."""
    rng = random.Random(11)
    defs = ("<radialGradient id='v' cx='50%' cy='50%' r='75%'><stop offset='.5' stop-color='#000' stop-opacity='0'/>"
            "<stop offset='1' stop-color='#000' stop-opacity='.55'/></radialGradient>"
            "<filter id='s' x='-5%' y='-5%' width='110%' height='110%'><feGaussianBlur stdDeviation='1.2'/></filter>")
    o = "<rect width='%d' height='%d' fill='#090909'/>" % (W, H)
    cx, cy = W * .5, H * .52
    turns, R = 5.2, 1000.0
    n = 1400
    # pontos de distorção: (posição t ao longo da espiral, largura, deslocamento radial, engrossamento)
    bumps = [(rng.uniform(.2, .95), rng.uniform(.018, .04), rng.choice([-1, 1]) * rng.uniform(35, 65), rng.uniform(.4, .9))
             for _ in range(7)]
    ph1, ph2 = rng.uniform(0, 6.28), rng.uniform(0, 6.28)
    left, right = [], []
    for i in range(n + 1):
        t = i / n
        th = t * turns * 2 * math.pi
        rr = R * t
        dr = 14 * math.sin(t * 23 + ph1) + 9 * math.sin(t * 61 + ph2)                      # tremor leve
        wd = 1 + .22 * math.sin(t * 17 + ph2)                                               # espessura variando
        for bt, bw, bd, bk in bumps:
            g = math.exp(-((t - bt) / bw) ** 2)
            dr += bd * g * math.sin((t - bt) * 220)                                         # trecho ondulado/distorcido
            wd += bk * g
        w = (24 + 14 * t) * wd * min(1, t * 14)                                              # grossa; afina só no centro
        rr += dr
        x, y = cx + rr * math.cos(th), cy + rr * math.sin(th)
        nx, ny = math.cos(th), math.sin(th)                                                  # espessura no sentido radial
        left.append((x + nx * w, y + ny * w)); right.append((x - nx * w, y - ny * w))
    pts = left + right[::-1]
    d = 'M' + ' L'.join('%s %s' % (f(x), f(y)) for x, y in pts) + 'Z'
    o += "<path d='%s' fill='#fff' fill-opacity='.12' filter='url(#s)'/>" % d
    o += "<path d='%s' fill='none' stroke='#fff' stroke-opacity='.18' stroke-width='2'/>" % d
    o += "<rect width='%d' height='%d' fill='url(#v)'/>" % (W, H)
    return svg(o, defs)


# ---------------------------------------------------------------- CONHECIMENTO
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


def jag(rng, x0, y0, x1, y1, amp, step=14):
    L = math.hypot(x1 - x0, y1 - y0); n = max(2, int(L / step))
    nx, ny = -(y1 - y0) / L, (x1 - x0) / L
    pts = []
    for i in range(n + 1):
        t = i / n
        a = 0 if i in (0, n) else rng.uniform(-amp, amp)
        pts.append((x0 + (x1 - x0) * t + nx * a, y0 + (y1 - y0) * t + ny * a))
    return pts


def conhecimento():
    rng = random.Random(23)
    defs = ("<filter id='n1' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='.011' numOctaves='4' seed='3'/>"
            "<feColorMatrix values='0 0 0 0 .42  0 0 0 0 .27  0 0 0 0 .08  0 0 0 .75 -.18'/></filter>"
            "<filter id='n2' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' seed='9'/>"
            "<feColorMatrix values='0 0 0 0 .3  0 0 0 0 .2  0 0 0 0 .07  0 0 0 .5 -.12'/></filter>"
            "<radialGradient id='e' cx='50%' cy='50%' r='72%'><stop offset='.4' stop-color='#5c3a0c' stop-opacity='0'/>"
            "<stop offset='.8' stop-color='#5c3a0c' stop-opacity='.5'/><stop offset='1' stop-color='#3a2206' stop-opacity='.9'/></radialGradient>"
            "<radialGradient id='s'><stop offset='0' stop-color='#7a5418' stop-opacity='.32'/><stop offset='1' stop-color='#7a5418' stop-opacity='0'/></radialGradient>")
    o = "<rect width='%d' height='%d' fill='#d8c28a'/>" % (W, H)
    o += "<rect width='%d' height='%d' filter='url(#n1)'/><rect width='%d' height='%d' filter='url(#n2)'/>" % (W, H, W, H)
    # manchas de umidade/café
    for i in range(14):
        r = rng.uniform(40, 150)
        o += "<circle cx='%s' cy='%s' r='%s' fill='url(#s)'/>" % (f(rng.uniform(0, W)), f(rng.uniform(0, H)), f(r))
    for i in range(5):
        cx, cy, r = rng.uniform(80, W - 80), rng.uniform(80, H - 80), rng.uniform(25, 60)
        o += "<path d='%s' fill='none' stroke='#6b4513' stroke-opacity='.22' stroke-width='3'/>" % blob(rng, cx, cy, r, 13, .12)
    # dobras
    for x in (W * .33, W * .67):
        o += "<path d='M%s 0 L%s %d' stroke='#5c3a0c' stroke-opacity='.22' stroke-width='2.5' fill='none'/>" % (f(x), f(x + rng.uniform(-8, 8)), H)
        o += "<path d='M%s 0 L%s %d' stroke='#fff3cf' stroke-opacity='.3' stroke-width='2' fill='none'/>" % (f(x + 3), f(x + 3 + rng.uniform(-8, 8)), H)
    for y in (H * .33, H * .66):
        o += "<path d='M0 %s L%d %s' stroke='#5c3a0c' stroke-opacity='.2' stroke-width='2.5' fill='none'/>" % (f(y), W, f(y + rng.uniform(-8, 8)))
        o += "<path d='M0 %s L%d %s' stroke='#fff3cf' stroke-opacity='.28' stroke-width='2' fill='none'/>" % (f(y + 3), W, f(y + 3 + rng.uniform(-8, 8)))
    # estrofes de letras ilegíveis em pontos aleatórios
    spots = []
    tries = 0
    while len(spots) < 22 and tries < 4000:
        tries += 1
        c = (rng.uniform(15, W - 330), rng.uniform(25, H - 170))
        if all(abs(c[0] - q[0]) > 250 or abs(c[1] - q[1]) > 110 for q in spots):
            spots.append(c)
    for (sx, sy) in spots:
        lines = rng.randint(3, 6); rot = rng.uniform(-9, 9); col = rng.choice(['#4a3213', '#5a3b14', '#3d290f'])
        d = ''
        for ln in range(lines):
            n = rng.randint(7, 20) if ln < lines - 1 else rng.randint(3, 9)
            ind = rng.choice([0, 0, 14])
            x = sx + ind
            for g in range(n):
                if rng.random() < .13:
                    x += 8; continue
                d += glyph_path(rng, x, sy + ln * 19)
                x += rng.uniform(9, 12)
        o += ("<path d='%s' transform='rotate(%s %s %s) translate(%s %s) scale(1.45) translate(%s %s)' fill='none' stroke='%s' stroke-opacity='%s' stroke-width='1.2' stroke-linecap='round'/>"
              % (d, f(rot), f(sx), f(sy), f(sx), f(sy), f(-sx), f(-sy), col, f(rng.uniform(.42, .62))))
    # bordas queimadas/escurecidas
    o += "<rect width='%d' height='%d' fill='url(#e)'/>" % (W, H)
    # rasgos internos
    for i in range(3):
        x0, y0 = rng.uniform(60, W - 60), rng.uniform(100, H - 300)
        a = rng.uniform(-.5, .5) + math.pi / 2
        L = rng.uniform(140, 320)
        pts = jag(rng, x0, y0, x0 + L * math.cos(a), y0 + L * math.sin(a), 9, 12)
        d = 'M' + ' L'.join('%s %s' % (f(p[0]), f(p[1])) for p in pts)
        o += "<path d='%s' fill='none' stroke='#2e1d08' stroke-opacity='.7' stroke-width='3' stroke-linejoin='bevel'/>" % d
        d2 = 'M' + ' L'.join('%s %s' % (f(p[0] + 3), f(p[1] + 1)) for p in pts)
        o += "<path d='%s' fill='none' stroke='#fbefc9' stroke-opacity='.65' stroke-width='1.6'/>" % d2
    # rasgados nas bordas (pedaços faltando, fundo escuro aparecendo)
    def tear(edge, pos, depth, span):
        if edge == 'top': a, b = (pos, 0), (pos + span, 0)
        elif edge == 'bottom': a, b = (pos, H), (pos + span, H)
        elif edge == 'left': a, b = (0, pos), (0, pos + span)
        else: a, b = (W, pos), (W, pos + span)
        pts = jag(rng, a[0], a[1], b[0], b[1], 0, 14)
        inner = []
        for i, p in enumerate(pts):
            dd = 0 if i in (0, len(pts) - 1) else rng.uniform(depth * .3, depth)
            if edge == 'top': inner.append((p[0], p[1] + dd))
            elif edge == 'bottom': inner.append((p[0], p[1] - dd))
            elif edge == 'left': inner.append((p[0] + dd, p[1]))
            else: inner.append((p[0] - dd, p[1]))
        poly = pts + inner[::-1]
        d = 'M' + ' L'.join('%s %s' % (f(p[0]), f(p[1])) for p in poly) + 'Z'
        edgeline = 'M' + ' L'.join('%s %s' % (f(p[0]), f(p[1])) for p in inner)
        return ("<path d='%s' fill='#241606'/><path d='%s' fill='none' stroke='#f6e8bd' stroke-opacity='.8' stroke-width='2.2' stroke-linejoin='bevel'/>"
                "<path d='%s' fill='none' stroke='#6b4513' stroke-opacity='.5' stroke-width='5' transform='translate(0 0)'/>" % (d, edgeline, edgeline))
    for edge, pos, depth, span in [('top', 120, 46, 190), ('top', 560, 30, 140), ('left', 380, 40, 210), ('right', 90, 44, 170),
                                   ('right', 880, 52, 240), ('bottom', 200, 38, 200), ('bottom', 640, 48, 170), ('left', 1180, 34, 150)]:
        o += tear(edge, pos, depth, span)
    return svg(o, defs)


# ---------------------------------------------------------------- ENERGIA
def bolt(rng, x, y, ang, length, depth=0):
    pts = [(x, y)]
    cx, cy = x, y; n = int(length / 50)
    branches = []
    for i in range(n):
        a = ang + rng.uniform(-.5, .5)
        step = rng.uniform(34, 70)
        cx += step * math.cos(a); cy += step * math.sin(a)
        pts.append((cx, cy))
        if depth < 2 and rng.random() < .32:
            branches.append((cx, cy, ang + rng.choice([-1, 1]) * rng.uniform(.5, 1.0), length * rng.uniform(.25, .5)))
    segs = [pts]
    for b in branches:
        segs += bolt(rng, b[0], b[1], b[2], b[3], depth + 1)
    return segs


def energia():
    rng = random.Random(31)
    defs = ("<linearGradient id='g' x1='0' y1='0' x2='.35' y2='1'><stop offset='0' stop-color='#2a0a55'/><stop offset='.45' stop-color='#5a1fb5'/>"
            "<stop offset='1' stop-color='#b48bff'/></linearGradient>"
            "<radialGradient id='h' cx='60%' cy='62%' r='55%'><stop offset='0' stop-color='#e5d2ff' stop-opacity='.45'/><stop offset='1' stop-color='#e5d2ff' stop-opacity='0'/></radialGradient>"
            "<filter id='b' x='-20%' y='-20%' width='140%' height='140%'><feGaussianBlur stdDeviation='6'/></filter>")
    o = "<rect width='%d' height='%d' fill='url(#g)'/><rect width='%d' height='%d' fill='url(#h)'/>" % (W, H, W, H)
    cols = ['#00e5ff', '#ff2fa8', '#f1e6ff', '#00e5ff', '#ff6bd0']
    glow = ''; core = ''
    for i in range(16):
        side = rng.random()
        if side < .55:
            x, y, ang = rng.uniform(0, W), rng.uniform(-40, 40), math.pi / 2 + rng.uniform(-.55, .55)
        elif side < .8:
            x, y, ang = rng.choice([-20, W + 20]), rng.uniform(0, H * .8), (0 if False else rng.choice([.4, math.pi - .4]) + rng.uniform(-.3, .3))
        else:
            x, y, ang = rng.uniform(0, W), rng.uniform(H * .45, H), -math.pi / 2 + rng.uniform(-.5, .5)
        col = rng.choice(cols); L = rng.uniform(380, 900)
        for seg in bolt(rng, x, y, ang, L):
            d = 'M' + ' L'.join('%s %s' % (f(p[0]), f(p[1])) for p in seg)
            w = rng.uniform(1.6, 3.6)
            glow += "<path d='%s' stroke='%s' stroke-opacity='.45' stroke-width='%s' fill='none' stroke-linejoin='round'/>" % (d, col, f(w * 3.5))
            core += "<path d='%s' stroke='%s' stroke-opacity='.8' stroke-width='%s' fill='none' stroke-linejoin='round'/>" % (d, '#ffffff' if rng.random() < .35 else col, f(w))
    o += "<g filter='url(#b)'>%s</g>%s" % (glow, core)
    # riscos (arranhões de energia)
    for i in range(90):
        x, y = rng.uniform(0, W), rng.uniform(0, H); a = rng.uniform(0, math.pi); L = rng.uniform(40, 220)
        col = rng.choice(['#ffffff', '#ffffff', '#00e5ff', '#ff2fa8'])
        o += ("<line x1='%s' y1='%s' x2='%s' y2='%s' stroke='%s' stroke-opacity='%s' stroke-width='%s' stroke-linecap='round'/>"
              % (f(x), f(y), f(x + L * math.cos(a)), f(y + L * math.sin(a)), col, f(rng.uniform(.1, .32)), f(rng.uniform(.8, 2.2))))
    # feixes de riscos paralelos
    for i in range(7):
        x, y = rng.uniform(0, W), rng.uniform(0, H); a = rng.uniform(0, math.pi); L = rng.uniform(90, 260)
        for k in range(rng.randint(3, 6)):
            off = k * rng.uniform(6, 10)
            o += ("<line x1='%s' y1='%s' x2='%s' y2='%s' stroke='#fff' stroke-opacity='.18' stroke-width='1.1'/>"
                  % (f(x + off * math.sin(a)), f(y - off * math.cos(a)), f(x + off * math.sin(a) + L * math.cos(a)), f(y - off * math.cos(a) + L * math.sin(a))))
    o += "<rect width='%d' height='%d' fill='#04000c' fill-opacity='.58'/>" % (W, H)   # escurece tudo
    return svg(o, defs)


if __name__ == '__main__':
    for nome, fn in [('sangue', sangue), ('morte', morte), ('energia', energia)]:   # 'conhecimento' aprovado: não regerar
        s = fn()
        open(os.path.join(OUT, 'bg-%s.svg' % nome), 'w').write(s)
        print(nome, len(s) // 1024, 'KB')
