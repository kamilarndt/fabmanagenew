import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots

# Data for the architecture diagram
layers = [
    {
        "name": "Input",
        "components": ["React/TSX", "SVG"],
        "color": "#1890ff"
    },
    {
        "name": "Processing", 
        "components": ["TSX Parser", "AST Analysis", "Ant Mapper", "Cond Analyzer"],
        "color": "#52c41a"
    },
    {
        "name": "Generation",
        "components": ["Comp Gen", "Token Gen", "Auto Layout", "Props Mgr"],
        "color": "#faad14"
    },
    {
        "name": "Figma",
        "components": ["Components", "Properties", "Variants", "Variables", "Auto Layout"],
        "color": "#722ed1"  
    },
    {
        "name": "UI",
        "components": ["Wizard", "Progress", "Error Handle", "Preview"],
        "color": "#eb2f96"
    }
]

fig = go.Figure()

# Define positions for each layer
layer_positions = {
    "Input": {"x": 1, "y": 5},
    "Processing": {"x": 3, "y": 4}, 
    "Generation": {"x": 5, "y": 3},
    "Figma": {"x": 7, "y": 2},
    "UI": {"x": 2, "y": 1}
}

# Add layer boxes and components
for layer in layers:
    layer_name = layer["name"]
    pos = layer_positions[layer_name]
    
    # Add main layer box
    fig.add_shape(
        type="rect",
        x0=pos["x"]-0.8, y0=pos["y"]-0.4,
        x1=pos["x"]+0.8, y1=pos["y"]+0.4,
        fillcolor=layer["color"],
        opacity=0.3,
        line=dict(color=layer["color"], width=2)
    )
    
    # Add layer label
    fig.add_trace(go.Scatter(
        x=[pos["x"]], y=[pos["y"]+0.6],
        text=[layer_name],
        mode="text",
        textfont=dict(size=14, color=layer["color"]),
        showlegend=False,
        hoverinfo='skip'
    ))
    
    # Add component boxes within each layer
    num_components = len(layer["components"])
    comp_width = 1.4 / max(num_components, 1)
    
    for i, component in enumerate(layer["components"]):
        comp_x = pos["x"] - 0.6 + (i * comp_width) + (comp_width/2)
        comp_y = pos["y"] - 0.1
        
        # Add component box
        fig.add_shape(
            type="rect",
            x0=comp_x-comp_width/2.5, y0=comp_y-0.15,
            x1=comp_x+comp_width/2.5, y1=comp_y+0.15,
            fillcolor="white",
            opacity=0.9,
            line=dict(color=layer["color"], width=1)
        )
        
        # Add component text
        fig.add_trace(go.Scatter(
            x=[comp_x], y=[comp_y],
            text=[component],
            mode="text",
            textfont=dict(size=9, color="black"),
            showlegend=False,
            hoverinfo='skip'
        ))

# Add arrows showing connections
arrows = [
    {"from": "Input", "to": "Processing"},
    {"from": "Processing", "to": "Generation"},
    {"from": "Generation", "to": "Figma"},
    {"from": "UI", "to": "Processing"}
]

for arrow in arrows:
    from_pos = layer_positions[arrow["from"]]
    to_pos = layer_positions[arrow["to"]]
    
    # Calculate arrow positions
    if arrow["from"] == "UI" and arrow["to"] == "Processing":
        # Special case for UI to Processing (upward arrow)
        fig.add_annotation(
            ax=from_pos["x"], ay=from_pos["y"]+0.4,
            x=to_pos["x"]-0.3, y=to_pos["y"]-0.4,
            xref="x", yref="y",
            axref="x", ayref="y",
            arrowhead=2,
            arrowsize=1.5,
            arrowwidth=2,
            arrowcolor="#666666",
            showarrow=True
        )
    else:
        # Horizontal arrows
        fig.add_annotation(
            ax=from_pos["x"]+0.8, ay=from_pos["y"],
            x=to_pos["x"]-0.8, y=to_pos["y"],
            xref="x", yref="y",
            axref="x", ayref="y", 
            arrowhead=2,
            arrowsize=1.5,
            arrowwidth=2,
            arrowcolor="#666666",
            showarrow=True
        )

# Update layout
fig.update_layout(
    title="Figma Plugin Architecture",
    xaxis=dict(
        range=[0, 8],
        showgrid=False,
        showticklabels=False,
        zeroline=False
    ),
    yaxis=dict(
        range=[0, 6],
        showgrid=False, 
        showticklabels=False,
        zeroline=False
    ),
    plot_bgcolor="white",
    showlegend=False
)

fig.write_image("architecture_diagram.png")