import { Pagination } from 'react-bootstrap';

export default function generatePaginationItems(
  currentPage: number,
  totalItems: number,
  itemsPerPage: number,
  handlePaginationClick: (pageNumber: number) => void
) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const visiblePages = 5;

  const items = [];

  // Funkcia pre generovanie 5 hlavných visible pagination itemov
  function generatePagination(start: number, end: number) {
    for (let i = start; i <= end; i += 1) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handlePaginationClick(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
  }

  // Vytvorenie pagination itemu "<<" pre presun na prvú stranu
  items.push(
    <Pagination.First key="first" onClick={() => handlePaginationClick(1)} />
  );

  // Vytvorenie pagination itemu "<" pre presun na predchadzájúcu stranu
  items.push(
    <Pagination.Prev
      key="prev"
      onClick={() => handlePaginationClick(Math.max(1, currentPage - 1))}
    />
  );

  // Vytvorenie pagination itemu "1" ak sa nenachádza medzi 5 hlavnými visible itemami
  if (
    visiblePages > 1 &&
    totalPages > Math.floor(visiblePages / 2) &&
    Math.min(currentPage - Math.floor(visiblePages / 2)) > 1
  ) {
    items.push(
      <Pagination.Item key="start" onClick={() => handlePaginationClick(1)}>
        {1}
      </Pagination.Item>
    );
    // Vytvorenie pagination itemu "..." medzi pagination itemom "1" a zvyšnými hlavnými visible itemami ak medzi nimi existujú aj iné itemy ktoré nie sú visible
    if (Math.min(currentPage - Math.floor(visiblePages / 2)) > 2) {
      items.push(<Pagination.Ellipsis key="ellipsisStart" />);
    }
  }

  // Volanie funkcie pre vytvorenie 5 hlavných visible itemov
  generatePagination(
    Math.max(1, currentPage - Math.floor(visiblePages / 2)),
    Math.min(currentPage + Math.floor(visiblePages / 2), totalPages)
  );

  // Vytvorenie pagination itemu "..." medzi hlavnými visible itemami a posledným číselným itemom ak medzi nimi existujú aj iné itemy ktoré nie sú visible

  if (
    visiblePages > 1 &&
    totalPages > Math.floor(visiblePages / 2) &&
    Math.min(currentPage + Math.floor(visiblePages / 2)) < totalPages - 1
  ) {
    items.push(<Pagination.Ellipsis key="ellipsisEnd" />);
  }

  // Vytvorenie pagination itemu s poslednou číselnou stranou ak sa nenachádza medzi 5 hlavnými visible itemami
  if (
    visiblePages > 1 &&
    totalPages > Math.floor(visiblePages / 2) &&
    Math.min(currentPage + Math.floor(visiblePages / 2)) < totalPages
  ) {
    items.push(
      <Pagination.Item
        key="end"
        onClick={() => handlePaginationClick(totalPages)}
      >
        {totalPages}
      </Pagination.Item>
    );
  }

  // Vytvorenie pagination itemu ">" pre presun na nasledujúcu stranu
  items.push(
    <Pagination.Next
      key="next"
      onClick={() =>
        handlePaginationClick(Math.min(currentPage + 1, totalPages))
      }
    />
  );

  // Vytvorenie pagination itemu ">>" pre presun na poslednú stranu
  items.push(
    <Pagination.Last
      key="last"
      onClick={() => handlePaginationClick(totalPages)}
    />
  );

  return items;
}
