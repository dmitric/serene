import React, { Component } from 'react'
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'
import Hammer from 'hammerjs'

import './App.css'


class App extends Component {
  constructor (props) {
    super(props)
    
    this.state = {
      pieces: 6,
      padding: 120,
      displayColorPickers: true,
      backgroundColor: {
        r:255,
        g:255,
        b:255,
        a:1
      },
      topColor: {
        r: 255,
        g: 0,
        b: 0
      },
      bottomColor: {
        r: 0,
        g: 0,
        b: 255
      }
    }
  }

  render() {
    const points = []

    for (let i=0; i < this.state.pieces; i++){
      points.push((this.state.pieces - i)/ this.state.pieces)
    }

    const alpha = Math.max(0.15, 1/this.state.pieces)

    const topColor = this.generateRGBA(this.state.topColor, alpha)
    const bottomColor = this.generateRGBA(this.state.bottomColor, alpha)
    const backgroundColor = this.generateRGBA(this.state.backgroundColor, this.state.backgroundColor.a)

    return (
      <div className="App">
        { this.state.displayColorPickers ? <div className="color-pickers">
          <ColorPicker color={this.state.backgroundColor} disableAlpha={false}
            handleChange={ (color) => this.setState({backgroundColor: color}) } />
          <ColorPicker color={this.state.topColor} disableAlpha={true}
            handleChange={ (color) => this.setState({topColor: color}) } />
          <ColorPicker color={this.state.bottomColor} disableAlpha={true}
            handleChange={ (color) => this.setState({bottomColor: color}) } />
        </div> : null } 
        <svg style={{padding: this.state.padding, backgroundColor}} width={this.state.width} height={this.state.height}>

          {points.map(i => {
            return (
              <path key={i} d={`M 0 ${this.state.height/2}
                a 1 1 0 1 1 ${this.state.width * i} 0`}
                fill={topColor}/>
            )
          })}

          {points.map(i => {
            return (
              <g key={i}>
                <path d={`M 0 ${this.state.height/2}
                  a 1 1 0 0 0 ${this.state.width * i} 0`} fill={bottomColor} />

                <path d={`M ${this.state.width * (1 - i)} ${this.state.height/2}
                  a 1 1 0 0 0 ${this.state.width * i} 0`}
                  fill={ this.state.width * (1 - i) === 0 ? 'transparent' : bottomColor } />
              </g>
            )
          })}

        </svg>
      </div>
    )
  }

  generateRGBA(rgb, alpha) {
    return `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`
  }

  updateDimensions () {
    const w = window,
        d = document,
        documentElement = d.documentElement,
        body = d.getElementsByTagName('body')[0]
    
    const width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
        height = w.innerHeight|| documentElement.clientHeight|| body.clientHeight

    const dim = Math.min(width, height) - this.state.padding * 2
    const settings = { width: dim , height: dim }
    
    if (width < 600) {
      settings["padding"] = 60
    } else {
      settings["padding"] = 120
    }

    this.setState(settings)
  }

  handleKeydown (ev) {
    if (ev.which === 67) {
      ev.preventDefault()
      this.setState({displayColorPickers: !this.state.displayColorPickers})
    } else if (ev.which === 40) {
      ev.preventDefault()
      
    } else if (ev.which === 38) {
      ev.preventDefault()
      this.addPiece()
    }
  }

  addPiece () {
    this.setState({pieces: Math.min(this.state.pieces+1 , 15) })
  }

  removePiece () {
    this.setState({pieces: Math.max(this.state.pieces-1 , 2) })
  }

  componentWillMount () {
    this.updateDimensions()
  }

  componentDidMount () {
    window.addEventListener("resize", this.updateDimensions.bind(this), true)
    window.addEventListener('keydown', this.handleKeydown.bind(this), true)
    
    const mc = new Hammer(document, { preventDefault: true })

    mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL })
    mc.get('pinch').set({ enable: true })

    mc.on("swipedown", ev => this.addPiece())
      .on("swipeup", ev => this.removePiece())

    this.updateDimensions()
  }

  componentWillUnmount () {
    window.removeEventListener("resize", this.updateDimensions.bind(this), true)
    window.removeEventListener('keydown', this.handleKeydown.bind(this), true)
  }
}

class ColorPicker extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      color: props.color,
      displayColorPicker: false,
      disableAlpha: props.disableAlpha
    }
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  };

  handleChange = (color) => {
    this.setState({ color: color.rgb })
    this.props.handleChange(color.rgb)
  };

  render () {

    const styles = reactCSS({
      'default': {
        color: {
          background: this.state.disableAlpha ?
                `rgb(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b })` :
                `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b },  ${ this.state.color.a })`,
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    })

    return (
      <div className='color-picker'>
        <div className='swatch' onClick={ this.handleClick }>
          <div className='color' style={ styles.color } />
        </div>
        { this.state.displayColorPicker ? <div style={ styles.popover }>
          <div style={ styles.cover } onClick={ this.handleClose }/>
          <SketchPicker color={ this.state.color } onChange={ this.handleChange } disableAlpha={this.state.disableAlpha} />
        </div> : null }
      </div>
    )
  }
}

export default App
