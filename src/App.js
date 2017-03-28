import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor (props) {
    super(props)
    
    this.state = {
      pieces: 6,
      padding: 30
    };
  }

  render() {
    const points = [];

    for (let i=0; i < this.state.pieces; i++){
      points.push((this.state.pieces - i)/ this.state.pieces);
    }

    const alpha = Math.max(0.15, 1/this.state.pieces);

    return (
      <div className="App" style={{ padding: this.state.padding }}>
        <svg width={this.state.width} height={this.state.height}>

          {points.map(i => {
            return (
              <path key={i} d={`M 0 ${this.state.height/2}
                a 1 1 0 1 1 ${this.state.width * i} 0`} fill={`rgba(255,0,0,${alpha})`}/>
            );
          })}

          {points.map(i => {
            return (
              <g key={i}>
                <path d={`M 0 ${this.state.height/2}
                  a 1 1 0 0 0 ${this.state.width * i} 0`} fill={`rgba(0,0,255,${alpha})`}/>

                <path d={`M ${this.state.width * (1 - i)} ${this.state.height/2}
                  a 1 1 0 0 0 ${this.state.width * i} 0`} fill={ this.state.width * (1 - i) === 0 ? 'transparent' : `rgba(0,0,255,${alpha})` }/>
              </g>
            );
          })}

        </svg>
      </div>
    );
  }

  updateDimensions () {
    const w = window,
        d = document,
        documentElement = d.documentElement,
        body = d.getElementsByTagName('body')[0]
    
    const width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
        height = w.innerHeight|| documentElement.clientHeight|| body.clientHeight

    const dim = Math.min(width, height) - this.state.padding * 2

    this.setState({ width: dim , height: dim});
  }

  handleKeydown (ev) {
    if (ev.which === 40) {
      ev.preventDefault()
      this.setState({pieces: Math.max(this.state.pieces-1 , 2) })
    } else if (ev.which === 38) {
      ev.preventDefault()
      this.setState({pieces: Math.min(this.state.pieces+1 , 15) })
    }
  }


  componentWillMount () {
    this.updateDimensions();
  }

  componentDidMount () {
    window.addEventListener("resize", this.updateDimensions.bind(this), true)
    window.addEventListener('keydown', this.handleKeydown.bind(this), true)
  }

  componentWillUnmount () {
    window.removeEventListener("resize", this.updateDimensions.bind(this), true)
    window.removeEventListener('keydown', this.handleKeydown.bind(this), true)
  }
}

export default App;
