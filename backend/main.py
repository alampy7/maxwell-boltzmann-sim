'''Para este proyecto se procuró usar PEP8 para una mejor comprensión del
mismo: https://peps.python.org/pep-0008/'''

#Primero, se importan las librerías necesarias
import numpy as np
import matplotlib.pyplot as plt

#Se importan las funciones del archivo mb_sim.py
from mb_sim import distribucion_MB, velocidades

def main():
     T = 1.0 #K
     N = 1000 #Número de partículas
     
     #Se crea el arreglo de velocidades
     vels = velocidades(T, N)
     
     #Se hace un histograma empírico
     num_bins = 50
     counts, bin_edges = np.histogram(vels, bins=num_bins, density=True)
     bin_centers = 0.5*(bin_edges[:-1] + bin_edges[1:])
     
     #Curva teórica
     v_teo = np.linspace(0, vels.max(), len(bin_centers))
     f_teo = distribucion_MB(v_teo, T) #masa=1.0
     
     #Se grafican los datos
     plt.figure()
     plt.hist(
         vels,
         bins=num_bins,
         density=True,
         alpha=0.6,
         label='Empírico (Monte Carlo)')
     plt.plot(v_teo, f_teo, label='Teórico Maxwell-Boltzmann')
     plt.xlabel('Rapidez (unidades arbitrarias)')
     plt.ylabel('Densidad de probabilidad')
     plt.title(f'Distribución de Maxwell-Boltzmann (T = {T} K, N = {N})')
     plt.legend()
     plt.grid(True)
     plt.show()
     

if __name__ == '__main__':
    main()
     