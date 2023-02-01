type ComponentProperties = {
    name: string;
    id: string;
    isVisible: string;
}

const Product = (props: ComponentProperties) => {
    return (
        <div>
            <div>Collezione: { props.name }</div>
        </div>
    );
}
export default Product;


