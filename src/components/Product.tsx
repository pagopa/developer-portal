type ComponentProperties = {
    name: string;
    id: string;
    isVisible: string;
}

const Product = (props: ComponentProperties) => {
    return (
        <div>
            <div>Collezione: { props.name }</div>
            <div>Visibilità: { props.isVisible }</div>
        </div>
    );
}
export default Product;


