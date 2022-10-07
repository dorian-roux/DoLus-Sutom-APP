# Motus 



```mermaid
sequenceDiagram
    Client ->>+ Authentification: Credentials (Login / Password)    
    Authentification ->>+ Client: Token
    Client ->>+ Back End: API Request
    Client ->>+ Back End: word
```


## Score Management


    which server are you gone use ?
    which port are you gone use ?
    which API are you gone call ? which parameters ?
    Can we handle more than one user ?
    What data do we want to store ?



#### API and Parameters

Les **scores** sont stockés dans un fichier JSON comprenant différentes information qui sont visibles sur le Diagramme d'Etat ci-dessous:  


[![](https://mermaid.ink/img/pako:eNp90U9LwzAUAPCv8silHWyV6q0Hwa0KCpuHTtiwHmLyZgNNUtIXQbZ9d9N0Bweb7_QIvyTvz54JK5EV7MvxroF1WRsI8fD-pESj0MFL9bqCGSRJJazDJPmAk4DZ7P6wsIYUGjrAPH0j1aqeE3oHm8mohphH-WxE6weXp0tLsPlH3I5ie13cRZFl2R8SWX6qSnfWEYI3UCoRf83T2ADcwMrqz5BIhHWonJP6xn5yuanFWVPbK-rxTI1VsSnT6DRXMsx2P9yrGTWosWZFSCXuuG-pZrU5Bso92erHCFaQ8zhlvpPhsVLxsBXNih1v-3CKUpF1y3FfcW3HX0wOiAw)](https://mermaid.live/edit#pako:eNp90U9LwzAUAPCv8silHWyV6q0Hwa0KCpuHTtiwHmLyZgNNUtIXQbZ9d9N0Bweb7_QIvyTvz54JK5EV7MvxroF1WRsI8fD-pESj0MFL9bqCGSRJJazDJPmAk4DZ7P6wsIYUGjrAPH0j1aqeE3oHm8mohphH-WxE6weXp0tLsPlH3I5ie13cRZFl2R8SWX6qSnfWEYI3UCoRf83T2ADcwMrqz5BIhHWonJP6xn5yuanFWVPbK-rxTI1VsSnT6DRXMsx2P9yrGTWosWZFSCXuuG-pZrU5Bso92erHCFaQ8zhlvpPhsVLxsBXNih1v-3CKUpF1y3FfcW3HX0wOiAw)

'''mermaid
graph TD
    A[Fichier JSON - ''Score''] 
    A -->|Contient| B(Utilisateur X)
        B -->|Inclut| B1(Mot XX)
        B -->|Inclut| B2(Mot XY)
        B -->|Inclut| B3(Mot ...)
            B1 -->|Comporte un Dict| B11(Score / Nombre de Tentatives)
    A -->|Contient| C(Utilisateur Y)
    A -->|Contient| E(Utilisateur ...)
'''


The way the **score** works is that the information are stored within a .JSON file with the Users Name (a matching ID with the LOGIN/PASSWORD is the final upgrade). Theres exists differents APIs that are callable that display information about 