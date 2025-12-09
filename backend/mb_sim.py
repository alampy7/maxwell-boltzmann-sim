'''Archivo que calcula la distribución teórica Maxwell-Boltzmann y con
el método Monte Carlo'''

import numpy as np

def velocidades(temp:float, num_part:int, masa:float = 1.0):
    '''Genera N (num_part) rapideces de partículas a una temperatura T (temp)
    en Kelvin y lo devuelve en un arreglo para Monte Carlo.'''
    
    '''Se garantiza que la temperatura, el número de partículas y la masa
    sean positivos'''
    if temp <= 0:
        raise ValueError('Recuerde que T, N, m > 0. Revise sus parámetros.')
    if num_part <= 0:
        raise ValueError('Recuerde que N > 0. Revise sus parámetros.')
    if masa <= 0:
        raise ValueError('Recuerde que m > 0. Revise sus parámetros.')
    
    #Consideramos sigma^2 = k_B * T / m, con k_B = 1
    sigma = np.sqrt(temp/masa)
       
    #Se generan las componentes de velocidad
    vel_comps = np.random.normal(loc=0.0, scale=sigma, size=(num_part, 3))
    
        
    #Obtenemos la rapidez del vector velocidad y se returna directamente
    return np.linalg.norm(vel_comps, axis=1)
    
    
def distribucion_MB(vels:np.ndarray, temp:float, masa:float = 1.0):
    '''Calcula la distribución teórica de Maxwell-Boltzmann a temperatura
    T y masa m'''
    
    #Nuevamente, se cuida que T,m > 0
    if temp <= 0:
        raise ValueError('Recuerde que T > 0.')
    if masa <= 0:
        raise ValueError('Recuerde que m > 0.')
    
    #Constante de normalización para k_B = 1
    #f(v) = 4pi (m/(2pi k_B T))^(3/2) v^2 exp(-m v^2 / (2T))
    k_B = 1
    const = 4 * np.pi * (masa / (2 * np.pi * k_B * temp))**(3/2)
    
    return const * (vels**2) * np.exp((-masa * (vels**2) / (2 * k_B * temp))) 