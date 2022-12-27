export default function Tile(props) {

    return (
        <div 
            style={{
                width: props.width, 
                height: props.height, 
                position: 'absolute',
                top: props.top,
                left: props.left
            }}>
            { props.children }
        </div>
    )
}