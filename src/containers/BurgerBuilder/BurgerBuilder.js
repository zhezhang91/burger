import React,{Component} from 'react';
import Aux from '../../hoc/Auxx';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Model from '../../components/UI/Model/Model';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';
import axios from '../../axios-orders';


class BurgerBuilder extends Component {

    state = {
        totalPrice: 4,
        purchaseable: false,
        purchasing: false,

    };


    componentDidMount () {
        console.log(this.props);
        this.props.onInitIngredients();

        //
        // axios.get('https://react-zhe-burger.firebaseio.com/price.json')
        //     .then(response => {
        //         INGREDIENTS_PRICES= response.data;
        //         console.log(response);
        //     })
        //     .catch(error => {
        //         this.setState({error: true})
        //     });
        //
        // axios.get('https://react-zhe-burger.firebaseio.com/totalprice.json')
        //     .then(response => {
        //         this.setState({totalPrice: response.data});
        //         console.log(response);
        //     })
        //     .catch(error => {
        //         this.setState({error: true})
        //     });
    }

    updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map(igKey => ingredients[igKey])
            .reduce((sum,el) => {
                return sum + el
            },0);
        return sum > 0;
    };
    //
    // AddIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     const updatedCount = oldCount + 1;
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     };
    //     updatedIngredients[type] = updatedCount;
    //     const priceAddition = INGREDIENTS_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice + priceAddition;
    //     this.setState({
    //         ingredients: updatedIngredients,
    //         totalPrice: newPrice,
    //     });
    //     this.updatePurchaseState(updatedIngredients);
    // };
    //
    // RemoveIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     if(oldCount <= 0) {
    //         return;
    //     }
    //     const updatedCount = oldCount - 1;
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     };
    //     updatedIngredients[type] = updatedCount;
    //     const priceDeduction = INGREDIENTS_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     let newPrice = oldPrice - priceDeduction;
    //     this.setState({
    //         ingredients: updatedIngredients,
    //         totalPrice: newPrice,
    //     });
    //     this.updatePurchaseState(updatedIngredients);
    // };

    purchaseHandler =() => {
        this.setState({purchasing: true})
    };

    purchaseCancelHandler = () => {
        this.setState({purchasing: false})
    };

    // pass the ingredients by query params, now using redux
    purchaseContinueHandler = () => {
        // const queryParams = [];
        //
        // for (let i in this.state.ingredients) {
        //     queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        // }
        //
        // queryParams.push('price=' + this.state.totalPrice);
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    };

    render() {

        const disableInfo = {
            ...this.props.ings
        };

        for (let key in disableInfo) {
            disableInfo[key] = disableInfo[key] <=0;
        }

        let orderSummary = null;

        let burger = this.props.error ? <p> Ingredients can't loaded!</p>:<Spinner/>;

        if(this.props.ings){
            burger = (
            <Aux>
                <Burger ingredients={this.props.ings}/>
                <BuildControls
                    ingredientAdded={this.props.onIngredientAdded}
                    ingredientRemoved={this.props.onIngredientRemoved}
                    disabled={disableInfo}
                    price={this.props.totalPrice}
                    purchaseable={this.updatePurchaseState(this.props.ings)}
                    ordered={this.purchaseHandler}/>
            </Aux>
        );
            orderSummary = <OrderSummary ingredients={this.props.ings}
                                         cancel={this.purchaseCancelHandler}
                                         continue={this.purchaseContinueHandler}
                                         totalPrice={this.props.totalPrice}/>;
        }


        return (
            <Aux>
                <Model show={this.state.purchasing} modelClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Model>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        totalPrice: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch( actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));