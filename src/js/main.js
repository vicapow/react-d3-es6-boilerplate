var d3 = require('d3')
var React = require('react')

// Example component
var PieChart = React.createClass({
  getDefaultProps() {
    return {
      width: 100,
      height: 100,
    }
  },
  render() {
    var {props} = this, {width, height, data} = props;
    var radius = Math.min(width, height) / 2
    var layout = d3.layout.pie()(data)
    var arcGen = d3.svg.arc()
      .innerRadius(radius * 0.2)
      .outerRadius(radius * 0.9)
    var color = d3.scale.category10();
    return <svg {...props}>
      <g transform={`translate(${width/2},${height/2})`}>
        {layout.map((d, i) => {
          return <path d={arcGen(d)} key={i} style={{fill: color(i)}}/>
        })}
      </g>
    </svg>
  }
})

var App = React.createClass({
  render() {
    return <section>
      <PieChart width={400} height={400} data={[1, 2, 3]}/>
    </section>
  }
})

React.render(<App />, document.body)