export class PipelineVisualizer {
  constructor(svgElementId) {
    this.svg = document.getElementById(svgElementId);
    this.nodes = [];
    this.edges = [];
    this.highlightedNodeId = null;
    this.initializeSvg();
  }

  initializeSvg() {
    if (!this.svg) return;
    this.svg.setAttribute('viewBox', '0 0 800 600');
  }

  render(pipelineData) {
    if (!this.svg) return;
    this.svg.innerHTML = '';
    this.nodes = pipelineData.nodes || [];
    this.edges = pipelineData.edges || [];
    this._createDefs();
    this._renderEdges(this.edges);
    this._renderNodes(this.nodes);
  }

  _createDefs() {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('markerWidth', '10');
    marker.setAttribute('markerHeight', '10');
    marker.setAttribute('refX', '9');
    marker.setAttribute('refY', '3');
    marker.setAttribute('orient', 'auto');
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', '0 0, 10 3, 0 6');
    polygon.setAttribute('fill', '#6b7280');
    marker.appendChild(polygon);
    defs.appendChild(marker);
    this.svg.appendChild(defs);
  }

  _renderEdges(edges) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('id', 'edges');
    edges.forEach(edge => {
      const fromNode = this.nodes.find(n => n.id === edge.from);
      const toNode = this.nodes.find(n => n.id === edge.to);
      if (!fromNode || !toNode) return;
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const d = 'M ' + (fromNode.x + 50) + ' ' + fromNode.y + ' L ' + (toNode.x - 50) + ' ' + toNode.y;
      path.setAttribute('d', d);
      path.setAttribute('stroke', '#6b7280');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('fill', 'none');
      path.setAttribute('marker-end', 'url(#arrowhead)');
      g.appendChild(path);
    });
    this.svg.appendChild(g);
  }

  _renderNodes(nodes) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('id', 'nodes');
    nodes.forEach(node => {
      const nodeGroup = this._createNodeElement(node);
      g.appendChild(nodeGroup);
    });
    this.svg.appendChild(g);
  }

  _createNodeElement(node) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('id', 'node-' + node.id);
    group.setAttribute('class', 'pipeline-node');
    group.setAttribute('data-node-id', node.id);
    const color = node.color || this._getColorByType(node.type);
    if (node.type === 'input' || node.type === 'output') {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', node.x);
      circle.setAttribute('cy', node.y);
      circle.setAttribute('r', '30');
      circle.setAttribute('fill', color);
      circle.setAttribute('stroke', '#000');
      circle.setAttribute('stroke-width', '2');
      group.appendChild(circle);
    } else if (node.type === 'process') {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', node.x - 50);
      rect.setAttribute('y', node.y - 30);
      rect.setAttribute('width', '100');
      rect.setAttribute('height', '60');
      rect.setAttribute('rx', '5');
      rect.setAttribute('fill', color);
      rect.setAttribute('stroke', '#000');
      rect.setAttribute('stroke-width', '2');
      group.appendChild(rect);
    } else if (node.type === 'validate') {
      const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      const points = node.x + ',' + (node.y - 40) + ' ' + (node.x + 40) + ',' + node.y + ' ' + node.x + ',' + (node.y + 40) + ' ' + (node.x - 40) + ',' + node.y;
      polygon.setAttribute('points', points);
      polygon.setAttribute('fill', color);
      polygon.setAttribute('stroke', '#000');
      polygon.setAttribute('stroke-width', '2');
      group.appendChild(polygon);
    } else if (node.type === 'error') {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', node.x);
      circle.setAttribute('cy', node.y);
      circle.setAttribute('r', '30');
      circle.setAttribute('fill', color);
      circle.setAttribute('stroke', '#000');
      circle.setAttribute('stroke-width', '2');
      circle.setAttribute('stroke-dasharray', '5,5');
      group.appendChild(circle);
    }
    if (node.label) {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', node.x);
      text.setAttribute('y', node.y);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dy', '0.3em');
      text.setAttribute('font-size', '12');
      text.setAttribute('font-weight', 'bold');
      text.setAttribute('fill', '#fff');
      text.setAttribute('pointer-events', 'none');
      text.textContent = node.label;
      group.appendChild(text);
    }
    return group;
  }

  _getColorByType(type) {
    const colors = {
      input: '#10b981',
      process: '#3b82f6',
      validate: '#f59e0b',
      output: '#10b981',
      error: '#ef4444',
    };
    return colors[type] || '#6b7280';
  }

  highlightNode(nodeId) {
    this.unhighlightNode();
    this.highlightedNodeId = nodeId;
    const nodeGroup = document.getElementById('node-' + nodeId);
    if (nodeGroup) {
      const shapes = nodeGroup.querySelectorAll('circle, rect, polygon');
      shapes.forEach(shape => {
        shape.setAttribute('stroke-width', '4');
        shape.setAttribute('stroke', '#06b6d4');
      });
    }
  }

  unhighlightNode() {
    if (!this.highlightedNodeId) return;
    const nodeGroup = document.getElementById('node-' + this.highlightedNodeId);
    if (nodeGroup) {
      const shapes = nodeGroup.querySelectorAll('circle, rect, polygon');
      shapes.forEach(shape => {
        shape.setAttribute('stroke-width', '2');
        shape.setAttribute('stroke', '#000');
      });
    }
    this.highlightedNodeId = null;
  }

  getNodeById(nodeId) {
    return this.nodes.find(n => n.id === nodeId);
  }
}

export default PipelineVisualizer;
