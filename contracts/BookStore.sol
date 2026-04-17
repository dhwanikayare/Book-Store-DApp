// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BookStore {
    address public owner;
    uint256 public bookIdCounter;

    struct Book {
        uint256 id;
        string title;
        string author;
        uint256 price;
        uint256 stock;
        bool exists;
    }

    mapping(uint256 => Book) public books;
    mapping(address => mapping(uint256 => uint256)) public purchases;

    event BookAdded(uint256 indexed bookId, string title, uint256 price);
    event BookPurchased(address indexed buyer, uint256 indexed bookId, uint256 quantity, uint256 totalCost);
    event FundsWithdrawn(address indexed owner, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

  function addBook(
    string memory _title,
    string memory _author,
    uint256 _price,
    uint256 _stock
) external onlyOwner {
    require(bytes(_title).length > 0, "Title required");
    require(bytes(_author).length > 0, "Author required");
    require(_price > 0, "Invalid price");
    require(_stock > 0, "Invalid stock");

    bookIdCounter++;

    books[bookIdCounter] = Book(
        bookIdCounter,
        _title,
        _author,
        _price,
        _stock,
        true
    );

    emit BookAdded(bookIdCounter, _title, _price);
}
    function purchaseBook(uint256 _bookId, uint256 _quantity) external payable {
        require(_quantity > 0, "Quantity must be > 0");
        require(books[_bookId].exists, "Invalid book");

        Book storage book = books[_bookId];
        require(book.stock >= _quantity, "Not enough stock");

        uint256 totalCost = book.price * _quantity;
        require(msg.value == totalCost, "Incorrect ETH sent");

        book.stock -= _quantity;
        purchases[msg.sender][_bookId] += _quantity;

        emit BookPurchased(msg.sender, _bookId, _quantity, totalCost);
    }

    function getBook(uint256 _bookId)
        external
        view
        returns (uint256, string memory, string memory, uint256, uint256)
    {
        require(books[_bookId].exists, "Invalid book");
        Book memory book = books[_bookId];
        return (book.id, book.title, book.author, book.price, book.stock);
    }

    function getAllBooks() external view returns (Book[] memory) {
        Book[] memory allBooks = new Book[](bookIdCounter);

        for (uint256 i = 1; i <= bookIdCounter; i++) {
            allBooks[i - 1] = books[i];
        }

        return allBooks;
    }

    function withdrawFunds() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds");

        payable(owner).transfer(balance);

        emit FundsWithdrawn(owner, balance);
    }
}