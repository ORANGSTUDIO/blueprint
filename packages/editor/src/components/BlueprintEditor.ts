import { Graph } from '@orang/blueprint-graph'
import { LitElement, css, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('blueprint-editor')
export class BlueprintEditor extends LitElement {
  @query('.blueprint-graph-container')
  container: HTMLElement | undefined;
  /**
   * Copy for the read the docs hint.
   */
  @property()
  docsHint = 'Click on the Vite and Lit logos to learn more'

  /**
   * The number of times the button has been clicked.
   */
  @property({ type: Number })
  count = 0

  @property({ type: Object })
  graphData = {
    "nodes": [
        {
            "id": "logic-start-node",
            "x": 175,
            "y": 284,
            "type": "logic-start-node",
        },
        {
            "type": "logic-end-node",
            "id": "logic-end-node",
            "x": 740,
            "y": 284,
        },
        {
            "id": "1684981368175660",
            "x": 270.796875,
            "y": 459,
            "type": "logic-variable-node",
            "data": {
              "uuid": "30ebcf14cc204376bc19e34913dbc87e",
            }
        }
    ],
    "edges": [
        {
            "type": "logic-statement-edge",
            "id": "16838001913853279",
            "source": "logic-start-node",
            "target": "logic-end-node",
            "sourceAnchor": 0,
            "targetAnchor": 0,
            "style": {
                "edgeState:default": {
                    "radius": 6,
                    "offset": -15,
                    "lineWidth": 3,
                    "stroke": "#1890FF",
                    "lineAppendWidth": 10,
                    "endArrow": null
                },
                "edgeState:selected": {
                    "radius": 6,
                    "offset": -15,
                    "lineWidth": 3,
                    "stroke": "#1890FF",
                    "lineAppendWidth": 10,
                    "endArrow": null
                },
                "edgeState:hover": {
                    "radius": 6,
                    "offset": -15,
                    "lineWidth": 3,
                    "stroke": "#1890FF",
                    "lineAppendWidth": 10,
                    "endArrow": null
                },
                "radius": 6,
                "offset": -15,
                "lineWidth": 3,
                "stroke": "#1890FF",
                "lineAppendWidth": 10,
            },
            "stateStyles": {
                "edgeState:default": {
                    "radius": 6,
                    "offset": -15,
                    "lineWidth": 3,
                    "stroke": "#1890FF",
                    "lineAppendWidth": 10,
                },
                "edgeState:selected": {
                    "radius": 6,
                    "offset": -15,
                    "lineWidth": 3,
                    "stroke": "#1890FF",
                    "lineAppendWidth": 10,
                },
                "edgeState:hover": {
                    "radius": 6,
                    "offset": -15,
                    "lineWidth": 3,
                    "stroke": "#1890FF",
                    "lineAppendWidth": 10,
                }
            },
            "startPoint": {
                "x": 280.5,
                "y": 291.05223880597015,
                "anchorIndex": 0
            },
            "endPoint": {
                "x": 634.5,
                "y": 291.05223880597015,
                "anchorIndex": 0
            }
        },
        {
            "type": "logic-variable-edge",
            "id": "16849813722697492",
            "source": "1684981368175660",
            "target": "logic-end-node",
            "sourceAnchor": 0,
            "targetAnchor": 1,
            "style": {
                "edgeState:default": {
                    "radius": 6,
                    "offset": -15,
                    "lineWidth": 2,
                    "stroke": "#52C41A",
                    "lineAppendWidth": 10,
                    "endArrow": {
                        "lineDash": [
                            0
                        ],
                        "path": "M 0,0 L 8,4 L 7,0 L 8,-4 Z",
                        "d": 0,
                        "fill": "#52C41A",
                        "stroke": "#52C41A"
                    }
                },
                "edgeState:selected": {
                    "radius": 6,
                    "offset": -15,
                    "lineWidth": 2,
                    "stroke": "#52C41A",
                    "lineAppendWidth": 10,
                    "endArrow": {
                        "lineDash": [
                            0
                        ],
                        "path": "M 0,0 L 8,4 L 7,0 L 8,-4 Z",
                        "d": 0,
                        "fill": "#52C41A",
                        "stroke": "#52C41A"
                    }
                },
                "edgeState:hover": {
                    "radius": 6,
                    "offset": -15,
                    "lineWidth": 2,
                    "stroke": "#52C41A",
                    "lineAppendWidth": 10,
                    "endArrow": {
                        "lineDash": [
                            0
                        ],
                        "path": "M 0,0 L 8,4 L 7,0 L 8,-4 Z",
                        "d": 0,
                        "fill": "#52C41A",
                        "stroke": "#52C41A"
                    }
                },
                "radius": 6,
                "offset": -15,
                "lineWidth": 2,
                "stroke": "#52C41A",
                "lineAppendWidth": 10,
                "endArrow": {
                    "lineDash": [
                        0
                    ],
                    "path": "M 0,0 L 8,4 L 7,0 L 8,-4 Z",
                    "d": 0,
                    "fill": "#52C41A",
                    "stroke": "#52C41A"
                }
            },
            "stateStyles": {
                "edgeState:default": {
                    "radius": 6,
                    "offset": -15,
                    "lineWidth": 2,
                    "stroke": "#52C41A",
                    "lineAppendWidth": 10,
                    "endArrow": {
                        "lineDash": [
                            0
                        ],
                        "path": "M 0,0 L 8,4 L 7,0 L 8,-4 Z",
                        "d": 0,
                        "fill": "#52C41A",
                        "stroke": "#52C41A"
                    }
                },
                "edgeState:selected": {
                    "radius": 6,
                    "offset": -15,
                    "lineWidth": 2,
                    "stroke": "#52C41A",
                    "lineAppendWidth": 10,
                    "endArrow": {
                        "lineDash": [
                            0
                        ],
                        "path": "M 0,0 L 8,4 L 7,0 L 8,-4 Z",
                        "d": 0,
                        "fill": "#52C41A",
                        "stroke": "#52C41A"
                    }
                },
                "edgeState:hover": {
                    "radius": 6,
                    "offset": -15,
                    "lineWidth": 2,
                    "stroke": "#52C41A",
                    "lineAppendWidth": 10,
                    "endArrow": {
                        "lineDash": [
                            0
                        ],
                        "path": "M 0,0 L 8,4 L 7,0 L 8,-4 Z",
                        "d": 0,
                        "fill": "#52C41A",
                        "stroke": "#52C41A"
                    }
                }
            },
            "data": {
                "varType": "string",
                "coercive": true
            },
            "startPoint": {
                "x": 346.296875,
                "y": 459,
                "anchorIndex": 0
            },
            "endPoint": {
                "x": 634.5,
                "y": 321.27611940298505,
                "anchorIndex": 1
            }
        }
    ],
    "combos": []
  }

  graph!: Graph

  render() {
    return html`
      <slot></slot>
      <div class="card">
        <button @click=${this._onClick} part="button">
          update graph
        </button>
        <div class="blueprint-graph-container"></div>
      </div>
      <p class="read-the-docs">${this.docsHint}</p>
    `
  }

  protected firstUpdated() {
    if (!this.container) {
      return
    }
    const graph = new Graph({ container: this.container })
    graph.updateGraphData(this.graphData)
    this.graph = graph
  }

  private _onClick() {
    this.graphData.nodes[0].x += 10
    this.graph.updateGraphData(this.graphData)
  }

  static styles = css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    .blueprint-graph-container {
      width: 1000px;
      height: 800px;
    }

    .logo {
      height: 6em;
      padding: 1.5em;
      will-change: filter;
      transition: filter 300ms;
    }
    .logo:hover {
      filter: drop-shadow(0 0 2em #646cffaa);
    }
    .logo.lit:hover {
      filter: drop-shadow(0 0 2em #325cffaa);
    }

    .card {
      padding: 2em;
    }

    .read-the-docs {
      color: #888;
    }

    ::slotted(h1) {
      font-size: 3.2em;
      line-height: 1.1;
    }

    a {
      font-weight: 500;
      color: #646cff;
      text-decoration: inherit;
    }
    a:hover {
      color: #535bf2;
    }

    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #1a1a1a;
      cursor: pointer;
      transition: border-color 0.25s;
    }
    button:hover {
      border-color: #646cff;
    }
    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }

    @media (prefers-color-scheme: light) {
      a:hover {
        color: #747bff;
      }
      button {
        background-color: #f9f9f9;
      }
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'blueprint-editor': BlueprintEditor
  }
}
