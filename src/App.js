import React from 'react';
import ReactDOM from 'react-dom/client';



//la fonction suivante nous permettra de representer une ligne de produits de notre table
function ProductRowComponent ({product})
{
    const name = product.stocked ? product.name :  <span className="text-danger">{product.name}</span>
    //on aurait aussi pu ecrire <span style={{color:'red'}}>{product.name}</span>
    console.log('render')
    console.log('render product')
    return <tr>
        <td>{name}</td>
        <td>{product.price}</td>
    </tr>
}
const ProductRow = React.memo(ProductRowComponent)
/**RQ: on aurait aussi pu ecrire: const ProductRow = React.memo(function ({product}){ ...}) */

//pour representer une ligne correspondant a une categorie
function ProductCategoryRow ({category})
{
    return <tr>
        <th colSpan="2">{category}</th>
    </tr>
}

function ProductTable ({products, inStockOnly, filterText}){
    const rows = []
    let lastCategory = null//permettra de conaitre la derniere categorie que l'on a rencontrer

    products.forEach(product => {
        if(inStockOnly && !product.stocked)
        {
            return
        }
        if(product.name.indexOf(filterText)===-1)//ie si le produit n'est pas un debut du filtertext
        {
            return 
        }
        if(lastCategory !== product.category)
        {
            lastCategory = product.category
            //on ecrit la category
            rows.push(<ProductCategoryRow key={lastCategory} category={product.category}/>)
        }
        //on ecrit le produits a la fin du tableau
        rows.push(<ProductRow key={product.name}  product={product}/>)
    })

    return <table className="table">
        <thead>
            <tr>
                <th>Nom</th>
                <th>Prix</th>
            </tr>
        </thead>
        <tbody>
            {rows}
        </tbody>
    </table>
}


class SearchBar extends React.Component
{
    constructor (props)
    {
        super(props)
        this.handleFilterTextChange = this.handleFilterTextChange.bind(this)
        this.handleInstockChange = this.handleInstockChange.bind(this)
    }

    handleFilterTextChange(e)
    {
        //je prend la propriete que j'ai recu et je lui envoie la valeur que j'ai recuperer dans mon champ a travers l'evenemnt onFilterChange
        this.props.onFilterChange(e.target.value)
    }
    handleInstockChange(e)
    {
        //j'ai prend la propriete que j'ai recu et je lui envoie la valeur que j'ai recuperer dans mon champ a travers l'evenemnt onFilterChange
        this.props.onStockChange(e.target.checked)
    }

    render()
    {
        const {filterText, inStockOnly}=this.props//la destructuration
        return <div className="mb-3">
            <div className="form-group mb-0">
                <input type="text" value={filterText} className="form-control" placeholder="Rechercher" onChange={this.handleFilterTextChange} />
            </div>
            <div className="form-check">
                <input type="checkbox" checked={inStockOnly} className="form-check-input" id="stock" onChange={this.handleInstockChange} />
                <label htmlFor="stock" className="form-check-label">Produit en stock seulement</label>
            </div>
        </div>
    }
}

//la classe ci-dessous est rendu pure afin de ne rendre (render) que les composant qui ont changer, ce qui optimise notre programme
class FilterableProductTable extends React.PureComponent
{
    constructor (props)
    {
        super(props)
        this.state = {
            filterText: '',
            inStockOnly: false
        }
        this.handleFilterTextChange = this.handleFilterTextChange.bind(this)
        this.handleInStockChange = this.handleInStockChange.bind(this)
    }

    
    handleFilterTextChange (filterText){
        this.setState({filterText}) // { filterText } <=> { filterText: filterText }
    }

    handleInStockChange (inStockOnly){
        this.setState({inStockOnly})
    }

    render()
    {
        const {products} = this.props
        return  <React.Fragment>
                    <SearchBar 
                            filterText={this.state.filterText}
                            inStockOnly={this.state.inStockOnly}
                            onFilterChange={this.handleFilterTextChange}
                            onStockChange={this.handleInStockChange} />
                    <ProductTable products = {products}
                    filterText={this.state.filterText}
                    inStockOnly={this.state.inStockOnly} />
                </React.Fragment>
    }
    //onFilterChange est un callback, on l'use lorsqu'on a besoin que les elt enfant informe les parents d'un changement 
}



/**on ecrit [...items, newItem] si on veut rajouter l'elt a la fin
[newItem, ...items] si on veut rajouter l'elt au debut*/


export default FilterableProductTable;
