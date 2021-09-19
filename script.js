let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'
let req = new XMLHttpRequest()

let baseTemp
let values =[]

let xScale
let yScale

let minYear
let maxYear
let ber

let width =1200
let height = 600
let padding = 60

let scribbler = d3.select('#scribbler')
scribbler.attr('width', width)
scribbler.attr('height', height)

let tooltip = d3.select('#tooltip')

let generateScales = () => {
    minYear = d3.min(values, (item) => {
        return item['year']
    })

    maxYear = d3.max(values, (item) => {
        return item['year']
    })
    xScale = d3.scaleLinear()
    .domain([minYear, maxYear + 1])
    .range([padding, width - padding])

    yScale = d3.scaleTime()
    .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
    .range([padding, height -padding])

}

let drawCells = () => {
    scribbler.selectAll('rect')
    .data(values)
    .enter()
    .append('rect')
    .attr('class', 'cell')
    .attr('fill', (item) => {
        variance = item['variance']
        if(variance <= -1) {
            return '#4682b4'
        } else if (variance <= 0) {
            return '#B0C4DE'
        } else if (variance <= 1) {
            return '#FFA500'
        } else {
            return '#DC143C'
        }
        
    })

    .attr('data-year', (item) => {
        return item['year']
    })
    .attr('data-month', (item) => {
        return item['month'] - 1
    })
    .attr('data-temp', (item) => {
        return baseTemp + item['variance']
    })

    .attr('height', (height -(2 * padding)) / 12)
    .attr('y', (item) => {
        return yScale(new Date(0, item['month'] -1, 0, 0, 0, 0, 0))
    })
    .attr('width', (item)=> {
        let numberOfYears = maxYear - minYear
        return (width - (2 * padding)) / numberOfYears
    })
    .attr('x', (item) => {
        return xScale(item['year'])
    })
    .on('mouseover', (item) => {
        tooltip.transition()
        .style('visibility', 'visible')

        let monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ]
        tooltip.text(item['year'] + ' ' + monthNames[item['month'] -1] + ' : ' + item['variance'])
    })
    
    
    .on('mouseout', (item) => {
        tooltip.transition()
            .style('visibility', 'hidden')
    })
}

let drawAxes = () => {

let xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format('d'))
let yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.timeFormat('%B'))

scribbler.append('g')
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr('transform', 'translate(0, '+ (height - padding)+')')

   scribbler.append('g')
   .call(yAxis)
   .attr('id', 'y-axis')
   .attr('transform', 'translate(' + padding + ',0' + ')')

}

req.open('GET', url, true)
req.onload = () => {
   let object = JSON.parse(req.responseText)
   baseTemp = object['baseTemperature']
   values = object['monthlyVariance']
   generateScales()
   drawCells()
   drawAxes()


}
req.send()