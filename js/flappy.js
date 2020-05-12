function newElement (tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}

let level = this.level
level = 1
let speed = this.speed
speed = 6

function Barrier (reverse = false) {
    this.element = newElement('div', 'barrier')
    const farend = newElement ('div', 'far-end')
    const body = newElement ('div', 'body')
    
    this.element.appendChild(reverse ? body : farend)
    this.element.appendChild(reverse ? farend : body)
    
    this.setHeight = height => body.style.height = `${height}px`
}

function PairOfBarriers (height, spacing, x){
    this.element = newElement ('div', 'pair-of-barriers')
    
    this.top = new Barrier(true)
    this.bottom = new Barrier(false)
    
    this.element.appendChild(this.top.element)
    this.element.appendChild(this.bottom.element) 

    this.randomSpacing = () => {
        const heightTop = Math.random()* (height- spacing)
        const heightBottom = height - spacing - heightTop
        
        this.top.setHeight(heightTop)
        this.bottom.setHeight(heightBottom)
    }
    
    this.getX = () => parseInt(this.element.style.left.split('px')[0])
    this.setX = x => this.element.style.left = `${x}px`
    this.getWidth = () => this.element.clientWidth 
    
    this.randomSpacing()
    this.setX(x)
}

function BarrierS (height, width, spacing, distance, pointing, nextLevel){
    this.pairs = [
            new PairOfBarriers(height,spacing, width),
            new PairOfBarriers(height,spacing, width + distance),
            new PairOfBarriers(height,spacing, width + 2 * distance),
            new PairOfBarriers(height,spacing, width + 3 * distance),
            new PairOfBarriers(height,spacing, width + 4 * distance),            
        ]
        
        

        this.animate = () => {
            this.pairs.forEach( pair => {
                pair.setX(pair.getX() - speed)

                    if(pair.getX() < -pair.getWidth()) {
                            pair.setX(pair.getX() + distance * 5 )
                            pair.randomSpacing()
                    }
    
                    
        
                const mid = width / 2
                const crossMid = pair.getX() + speed >= mid && pair.getX() < mid
                if(crossMid){
                    pointing()
                    nextLevel()
                    console.log(`Pontos: ${points}`)
                    
                }
            })
        }
        
       
    }

    
    function Bird(heightScreen){
        let flyng = false
        
        this.element = newElement('img', 'bird')
        this.element.src = 'imgs/bird.png'
        
        this.getY = () => parseInt(this.element.style.bottom.split('px')[0])
        this.setY = (y) => this.element.style.bottom = `${y}px`
        
        window.onkeydown = e => flyng = true
        window.onkeyup = e => flyng = false

        this.animate = () => {
            const newY = this.getY() + (flyng ? 8 : -5)
            const maximumHeight = heightScreen - this.element.clientHeight - 15
            
            if(newY <= 0){
                this.setY(0)
            } else if (newY >= maximumHeight){
                this.setY(maximumHeight)
            } else{
                this.setY(newY)
            }
        }
        this.setY (heightScreen / 2)
    }
    
        function levelProgress() {
            this.element = newElement('span', 'levelprogress')
            
            
            this.attLevel = level => {
                this.element.innerHTML = level
                if(level > 1){
                screenNextLevel()
                }
            }

            this.attLevel(level)

        }

    function Pointing(){
        this.element = newElement ('span', 'progress')
        points = this.element.points
        points = 0
        this.attPoints = points => {
            this.element.innerHTML = points
        }
        this.attPoints(points)
    }
    
   function screenNextLevel(){
    setTimeout(() => {
        Screen = document.querySelector('.next-level')
        
        console.log(Screen)
        Screen.style.left = "00000px"

        let resetBarriers = document.querySelectorAll('.pair-of-barriers');
        [].slice.call(resetBarriers).forEach(function (element) {
            this.getX = () => parseInt(element.style.left.split('px')[0])
            this.setX = x => element.style.left = `${x}px`
            let posicao = this.getX(element)
            let posicaonova = posicao + 2500
            this.setX(posicaonova)

        });
        setTimeout(() => {
            Screen.style.left = "-1000000px"
            points = 0
            console.log(`level: ${level}`)
        }, 3000)

    }, 500)
   }
    
    function overflow (A, B) {
        
        const a = A.getBoundingClientRect()
        const b = B.getBoundingClientRect()
        rightsizeA = a.left + a.width
        rightsizeB = b.left + b.width
        bottomA = a.top + a.height
        bottomB = b.top + b.height
        const horizontal = rightsizeA >= b.left &&  rightsizeB >= a.left
        const vertical = bottomA >= b.top && bottomB >= a.top

        return horizontal && vertical
    }   

    function collided (bird, barriers) {
        let collided = false
        barriers.pairs.forEach(PairOfBarriers => {
            if(!collided){
                const top = PairOfBarriers.top.element
                const bottom = PairOfBarriers.bottom.element

                collided = overflow(bird.element, top) || overflow(bird.element, bottom)
            }
        })
        return collided
    }
    
    
    function Flappy() {
        const area = document.querySelector('[wm-flappy]')
        const levelprogress = new levelProgress()
        const Height = area.clientHeight
        const Width = area.clientWidth
        const progress = new Pointing()
        const barriers = new BarrierS(Height, Width, 200, 400, () => progress.attPoints(++points), () => {if(points >= level *5){levelprogress.attLevel(++level)}})
        const bird = new Bird(Height)
        
        area.appendChild(levelprogress.element)
        area.appendChild(progress.element)
        area.appendChild(bird.element)
        barriers.pairs.forEach(pair => area.appendChild(pair.element))
        
        this.start = () => {
            
        const timer = setInterval(()=>{
            barriers.animate()
                bird.animate()

                if( collided(bird, barriers)){
                     clearInterval(timer)
                }
            }, 20)            
        }
    } 
    

    new Flappy().start()