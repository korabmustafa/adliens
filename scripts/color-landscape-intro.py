"""Match the bundled landscape film's planets to the portrait film palette.

Requires Python/numpy and ffmpeg. Keeps the original framing, motion, sound and
22-second timing; grades only the revealed surfaces of planets two and three.
Run from the repository root: python scripts/color-landscape-intro.py
"""
from pathlib import Path
import subprocess
import tempfile
import numpy as np

SOURCE = Path('public/adliens-intro (2).mp4')
scratch = tempfile.TemporaryDirectory(prefix='adliens-film-')
OUTPUT = Path(scratch.name) / 'landscape.mp4'
WIDTH, HEIGHT, FPS = 1280, 720, 24
# Fixed sphere coordinates in the original landscape composition.
PLANETS = [
    (680, 482, 79, 9.5, np.array([[0, .70, .30], [0, .18, .30], [0, .50, 1.0]])),
    (1036, 288, 125, 13.5, np.array([[0, 1.1, .60], [0, .50, .20], [0, .15, .10]])),
]
reader = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', str(SOURCE),
    '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
writer = subprocess.Popen(['ffmpeg', '-y', '-v', 'error', '-f', 'rawvideo',
    '-pix_fmt', 'rgb24', '-s', f'{WIDTH}x{HEIGHT}', '-r', str(FPS), '-i', '-',
    '-i', str(SOURCE), '-map', '0:v', '-map', '1:a?', '-c:v', 'libx264',
    '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'copy',
    '-movflags', '+faststart', '-shortest', str(OUTPUT)], stdin=subprocess.PIPE)
frame_number = 0
while True:
    data = reader.stdout.read(WIDTH * HEIGHT * 3)
    if not data:
        break
    if len(data) != WIDTH * HEIGHT * 3:
        raise RuntimeError('Incomplete input frame')
    frame = np.frombuffer(data, dtype=np.uint8).reshape(HEIGHT, WIDTH, 3).copy()
    time = frame_number / FPS
    for cx, cy, radius, start, palette in PLANETS:
        if not start <= time <= 18:
            continue
        x0, y0, size = cx-radius, cy-radius, radius*2+1
        region = frame[y0:y0+size, x0:x0+size]
        rgb = region.astype(np.float32)
        red, green, blue = np.moveaxis(rgb, -1, 0)
        # Gray/brown untransformed rock and white sparkles keep their colors.
        chroma = np.maximum(green, blue) - red
        reveal = np.clip((chroma / np.maximum(rgb.max(axis=-1), 1) - .12) / .22, 0, 1)
        yy, xx = np.ogrid[-radius:radius+1, -radius:radius+1]
        sphere = np.clip((radius - np.sqrt(xx*xx + yy*yy)) / 2, 0, 1)
        blend = (reveal * sphere)[..., None]
        graded = rgb @ palette.T
        # Retain the source's illumination and shading across the surface.
        graded *= (rgb.max(axis=-1, keepdims=True) /
                   np.maximum(graded.max(axis=-1, keepdims=True), 1))
        region[:] = np.clip(rgb*(1-blend) + graded*blend, 0, 255).astype(np.uint8)
    writer.stdin.write(frame.tobytes())
    frame_number += 1
writer.stdin.close()
if reader.wait() or writer.wait():
    raise RuntimeError('ffmpeg failed')
print(f'Rendered {frame_number} frames to {OUTPUT}')

# Extend the atmospheric background to keep text and planets inside safe framing
# when a browser viewport is taller/wider than the original film compositions.
for source, output, width, height in [
    (OUTPUT, 'public/adliens-intro-landscape.mp4', 1600, 900),
    ('public/adliens-intro-mobile.mp4', 'public/adliens-intro-portrait.mp4', 720, 1560),
]:
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', str(source),
        '-filter_complex', '[0:v]split[base][front];'
        f'[base]scale={width}:{height}:force_original_aspect_ratio=increase,'
        f'crop={width}:{height},boxblur=30:2[background];'
        "[front]format=yuva420p,geq=lum='lum(X,Y)':cb='cb(X,Y)':cr='cr(X,Y)':"
        "a='255*clip(min(min(X,W-1-X),min(Y,H-1-Y))/40,0,1)'[soft];"
        '[background][soft]overlay=(W-w)/2:(H-h)/2,setsar=1[film]',
        '-map', '[film]', '-map', '0:a?', '-c:v', 'libx264', '-preset', 'medium',
        '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-movflags', '+faststart',
        output], check=True)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-sseof', '-0.1',
        '-i', output, '-frames:v', '1', output.replace('.mp4', '-end.webp')], check=True)
scratch.cleanup()
