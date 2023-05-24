export const Icon = ({src, style, height}: {src:string, style?: React.CSSProperties, height?: string | number}) => {
    return (
        <img src={src} style={style} height={height ? height : '50px'} />
    )
}
