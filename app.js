// Storage Controller
const StorageController = (function () {

    return {
        storeProduct: async function (product) {

            prod = JSON.stringify(product)
            prodList = []
            await fetch('http://localhost:3000', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: prod

            })
                .then(response => response.json())
                .then(data => console.log('product added to db'))
                .catch(error => {
                    console.log(error)
                });
        },
        getProducts: async function () {

            //fetch API
            let products = []
            products = await fetch('http://localhost:3000', {
                method: 'get',
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => response.json())
                .then(json => {
                    let prod = []
                    prod = json
                    return prod;
                })
                .catch(error => {
                    console.log(error)
                });
            return products
        },
        updateProduct: async function (product) {
            prod = JSON.stringify(product)
            console.log(prod)
            await fetch('http://localhost:3000', {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: prod
            })
                .then(result => {
                })
                .catch(error => {
                    console.log(error)
                });
        },
        deleteProduct: async function (product) {
            prod = JSON.stringify(product)
            await fetch('http://localhost:3000', {
                method: 'delete',
                headers: { 'Content-Type': 'application/json' },
                body: prod
            })
                .then(result => {
                    console.log('result ' + result.json())
                })
                .catch(error => {
                    console.log(error)
                });
        }
    }

})();

// Product Controller
const ProductController = (function () {

    // private
    const Product = function (name, price) {
        this.name = name;
        this.price = price;
    }

    const data = {
        products: StorageController.getProducts(),
        selectedProduct: null,
        totalPrice: 0
    }

    // public
    return {
        getProducts: function () {
            return StorageController.getProducts();
        },
        getData: function () {
            return data;
        },
        getProductById: async function (id) {
            let product = null;
            await data.products.then((val) => {
                val.forEach(function (prd) {
                    if (prd._id == id) {
                        product = prd;
                    }
                });
            })
            return product;
        },
        setCurrentProduct: function (product) {
            data.selectedProduct = product;
        },
        getCurrentProduct: async function () {
            let val = await data.selectedProduct;
            return val;
        },
        addProduct: function (name, price) {

            const newProduct = new Product(name, parseFloat(price));
            return newProduct;
        },
        updateProduct: async function (name, price) {
            let product = null;
            await data.products.then((val) => {
                val.forEach(function (prd) {
                    if (prd._id == data.selectedProduct._id) {
                        prd.name = name;
                        prd.price = parseFloat(price);
                        product = prd;
                    }
                });
            });
            return product;
        },
        getTotal: async function () {
            let total = 0;
            await data.products.then((val) => {
                val.forEach(function (item) {
                    total += parseInt(item.price);
                });
            }).catch(err => console.log(err))
            data.totalPrice = total;
            return data.totalPrice;
        }
    }

})();


// UI Controller

const UIController = (function () {

    const Selectors = {
        productList: "#item-list",
        productListItems: "#item-list tr",
        addButton: '.addBtn',
        updateButton: '.updateBtn',
        cancelButton: '.cancelBtn',
        deleteButton: '.deleteBtn',
        productName: '#productName',
        productPrice: '#productPrice',
        productCard: '#productCard',
        totalTL: '#total-tl',
        totalDolar: '#total-dolar'
    }

    return {
        createProductList: function (products) {
            let html = '';

            products.forEach(prd => {
                html += `
                  <tr>
                     <td id="${prd._id}"></td>
                     <td>${prd.name}</td>
                     <td>${prd.price} $</td>
                     <td class="text-right">                       
                        <i class="far fa-edit edit-product"></i>                       
                    </td>
                  </tr>   
                `;
            });

            document.querySelector(Selectors.productList).innerHTML = html;
        },
        getSelectors: function () {
            return Selectors;
        },
        addProduct: function (prd) {

            document.querySelector(Selectors.productCard).style.display = 'block';
            var item = `            
                <tr>
                <td id="${prd._id}"></td>
                <td>${prd.name}</td>
                <td>${prd.price} $</td>
                <td class="text-right">
                   <i class="far fa-edit edit-product"></i>
                </td>
            </tr>              
            `;

            document.querySelector(Selectors.productList).innerHTML += item;
        },
        updateProduct: async function (prd) {
            let updatedItem = null;
            let items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function (item) {
                if (item.classList.contains('bg-warning')) {
                    item.children[1].textContent = prd.name;
                    item.children[2].textContent = prd.price + ' $';
                    updatedItem = item;
                }
            });

            return updatedItem;
        },
        clearInputs: function () {
            document.querySelector(Selectors.productName).value = '';
            document.querySelector(Selectors.productPrice).value = '';
        },
        clearWarnings: function () {
            const items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function (item) {
                if (item.classList.contains('bg-warning')) {
                    item.classList.remove('bg-warning');
                }
            });
        },
        hideCard: function () {
            document.querySelector(Selectors.productCard).style.display = 'none';
        },
        showTotal: async function (total) {
            document.querySelector(Selectors.totalDolar).textContent = await total;
            document.querySelector(Selectors.totalTL).textContent = await total * 8.5;
        },
        addProductToForm: async function () {
            const selectedProduct = await ProductController.getCurrentProduct();
            document.querySelector(Selectors.productName).value = selectedProduct.name;
            document.querySelector(Selectors.productPrice).value = selectedProduct.price;
        },
        deleteProduct: function () {
            let items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function (item) {
                if (item.classList.contains('bg-warning')) {
                    item.remove();
                }
            });
        },
        addingState: function (item) {
            UIController.clearWarnings();
            UIController.clearInputs();
            document.querySelector(Selectors.addButton).style.display = 'inline';
            document.querySelector(Selectors.updateButton).style.display = 'none';
            document.querySelector(Selectors.deleteButton).style.display = 'none';
            document.querySelector(Selectors.cancelButton).style.display = 'none';
        },
        editState: function (tr) {
            tr.classList.add('bg-warning');
            document.querySelector(Selectors.addButton).style.display = 'none';
            document.querySelector(Selectors.updateButton).style.display = 'inline';
            document.querySelector(Selectors.deleteButton).style.display = 'inline';
            document.querySelector(Selectors.cancelButton).style.display = 'inline';
        }
    }
})();


// App Controller
const App = (function (ProductCtrl, UICtrl, StorageCtrl) {

    const UISelectors = UICtrl.getSelectors();

    // Load Event Listeners
    const loadEventListeners = function () {

        // add product event
        document.querySelector(UISelectors.addButton).addEventListener('click', productAddSubmit);

        // edit product click
        document.querySelector(UISelectors.productList).addEventListener('click', productEditClick);

        // edit product submit
        document.querySelector(UISelectors.updateButton).addEventListener('click', editProductSubmit);

        // cancel button click
        document.querySelector(UISelectors.cancelButton).addEventListener('click', cancelUpdate);

        // delete product
        document.querySelector(UISelectors.deleteButton).addEventListener('click', deleteProductSubmit);

    }

    const productAddSubmit = async function (e) {

        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if (productName !== '' && productPrice !== '') {
            // Add product
            const newProduct = ProductCtrl.addProduct(productName, productPrice);

            // add item to list
            UICtrl.addProduct(newProduct);

            // add product to DB
            StorageCtrl.storeProduct(newProduct);

            // get total
            const total = await ProductCtrl.getTotal();

            // show total
            await UICtrl.showTotal(total);

            // clear inputs
            UICtrl.clearInputs();
        }

        console.log(productName, productPrice);

    }

    const productEditClick = async function (e) {

        if (e.target.classList.contains('edit-product')) {

            const id = e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.id;

            // get selected product
            const product = await ProductCtrl.getProductById(id);

            // set current product
            ProductCtrl.setCurrentProduct(product);

            UICtrl.clearWarnings();

            // add product to UI
            UICtrl.addProductToForm();

            UICtrl.editState(e.target.parentNode.parentNode);
        }
        e.preventDefault();
    }

    const editProductSubmit = async function (e) {

        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if (productName !== '' && productPrice !== '') {

            // update product
            const updatedProduct = await ProductCtrl.updateProduct(productName, productPrice);

            // update ui
            let item = await UICtrl.updateProduct(updatedProduct);

            // get total
            const total = await ProductCtrl.getTotal();

            // show total
            UICtrl.showTotal(total);

            // update storage
            StorageCtrl.updateProduct(updatedProduct);

            UICtrl.addingState();

        }


    }

    const cancelUpdate = function (e) {

        UICtrl.addingState();
        UICtrl.clearWarnings();

        e.preventDefault();
    }

    const deleteProductSubmit = async function (e) {

        // get selected product
        const selectedProduct = await ProductCtrl.getCurrentProduct();


        // delete ui
        UICtrl.deleteProduct();

        // delete from storage
        StorageCtrl.deleteProduct(selectedProduct);

        // get total
        const total = await ProductCtrl.getTotal();

        // show total
        UICtrl.showTotal(total);


        UICtrl.addingState();

        if (total == 0) {
            UICtrl.hideCard();
        }

    }

    return {
        init: async function () {
            console.log('starting app...');

            UICtrl.addingState();

            const products = await ProductCtrl.getProducts();

            if (products.length == 0) {
                UICtrl.hideCard();
            } else {
                UICtrl.createProductList(products);
            }

            // get total
            const total = ProductCtrl.getTotal();

            // show total
            UICtrl.showTotal(total);

            // load event listeners
            loadEventListeners()

        }
    }


})(ProductController, UIController, StorageController);

App.init();




