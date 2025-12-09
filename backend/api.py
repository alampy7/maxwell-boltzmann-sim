#Con este archivo se crea la API

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import numpy as np

from mb_sim import distribucion_MB, velocidades

app = FastAPI(
    title='Maxwell-Bolztmann API',
    description='API sencilla',
    version='0.1.0'
)

#CORS es para que luego React haga peticiones sin pex
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

#@app.get sirve para que sea fácil llamar funciones desde el navegador
@app.get('/')
def read_root():
    return {'message':'API del simulador funcionando :)'}

#Añadimos las masas molares de varios gases:
#https://es.webqc.org/molecular-weight-of-Neon.html
gases = {
    'He':4.0,
    'Ne':20.18,
    'Ar':39.95,
    'Xe':131.29,
    'N2':28.0,
    'O2':32.0
}

@app.get('/simulate')
def simulate(T:float = 1.0, N: int = 10000, gas:str ='Ar', bins: int = 50):
    '''Simula la distribución de velocidades para una temperatura T y N
    partículas. Devuelve un histograma empírico y una curva teórica.
    Por defecto calcula para 1K, 10000 partículas y 50 bins.'''
    
    if T <= 0:
        return {'error':'T > 0.'}
    if N <= 0:
        return {'error':'N > 0.'}
    if bins <= 0:
        return {'error':'bins > 0.'}
    
    '''Se elige la masa molar de acuerdo al gas. Se busca en el diccionario.
    Si no lo encuentra, devuelve el valor por defecto: Ar'''
    gas_clave = gas if gas in gases else 'Ar'
    m = gases[gas_clave]
    
    #Se generan las velocidades por Monte Carlo
    vels = velocidades(T, N, masa=m)
    
    #Ahora tomamos las 200 velocidades menores para animar
    num_anim = min(200, len(vels))
    vels_anim = vels[:num_anim]
    
    #Se hace un histograma empírico
    counts, edges = np.histogram(vels, bins=bins, density=True)
    bin_centers = 0.5 * (edges[:-1] + edges[1:])
    
    #Curva teórica
    v_teo = np.linspace(0, float(vels.max()), 200)
    f_teo = distribucion_MB(vels, T, masa=m)
    
    #Se convierten los datos para que FastAPI los serialice a JSON
    return {
        'T': float(T),
        'N': int(N),
        'gas': gas_clave,
        'bins': int(bins),
        'mass': m,
        'bin_centers': bin_centers.tolist(),
        'hist_values': counts.tolist(),
        'v_teo': v_teo.tolist(),
        'f_teo': f_teo.tolist(),
        'velocities': vels_anim.tolist(),
    }