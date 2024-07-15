import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Checkbox,
  TablePagination,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import config from "../../config";

const LastFiveArticles = ({ refreshArticles }) => {
  const [articles, setArticles] = useState([]);
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          `${config.BOTS_V2_API}/last_five_articles`,
        );
        const result = await response.json();
        if (Array.isArray(result.data)) {
          setArticles(result.data);
        } else {
          console.error("Not an array", result.data);
        }
      } catch (error) {
        console.error("error: ", error);
      }
    };

    fetchArticles();
  }, [refreshArticles]); 
  

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = articles.map((article) => article.id);
      setSelectedArticles(newSelecteds);
      return;
    }
    setSelectedArticles([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selectedArticles.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedArticles, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedArticles.slice(1));
    } else if (selectedIndex === selectedArticles.length - 1) {
      newSelected = newSelected.concat(selectedArticles.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedArticles.slice(0, selectedIndex),
        selectedArticles.slice(selectedIndex + 1),
      );
    }

    setSelectedArticles(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchArticles = async () => {
    try {
      const response = await fetch(
        `${config.BOTS_V2_API}/last_five_articles`,
      );
      const result = await response.json();
      console.log("data q llega", result);
      if (Array.isArray(result.data)) {
        setArticles(result.data);
      } else {
        console.error("Not and array", result.data);
      }
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const handleDelete = async () => {
    // Lógica para eliminar los artículos seleccionados
    try {
      for (const articleId of selectedArticles) {
        const response = await fetch(
          `${config.BOTS_V2_API}/delete_article?article_id=${articleId}`,
          {
            method: "DELETE",
          }
        );
        const result = await response.json();
        console.log(result.message); // Mensaje de éxito o error
        // Aquí podrías actualizar el estado local si lo necesitas
      }
      // Luego de eliminar, volvemos a cargar los artículos actualizados
      fetchArticles();
    } catch (error) {
      console.error("Error deleting articles:", error);
    }
  };
  

  const isSelected = (id) => selectedArticles.indexOf(id) !== -1;

  return (
    <>
    <Paper>
      <Typography variant="h6" component="div" style={{ padding: "16px" }}>
        Last 5 Articles
        {selectedArticles.length > 0 && (
          <IconButton
            color="secondary"
            onClick={handleDelete}
            style={{ margin: "16px", float: "right" }}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedArticles.length > 0 &&
                    selectedArticles.length < articles.length
                  }
                  checked={
                    articles.length > 0 &&
                    selectedArticles.length === articles.length
                  }
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Coin</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(articles) &&
              articles
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((article) => {
                  const isItemSelected = isSelected(article.id);
                  return (
                    <TableRow
                      key={article.id}
                      hover
                      onClick={(event) => handleClick(event, article.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isItemSelected} />
                      </TableCell>
                      <TableCell>{article.category_name}</TableCell>
                      <TableCell>{article.bot_name}</TableCell>
                      <TableCell>
                        <b>{article.title}</b> - {article.content}
                      </TableCell>
                      <TableCell>
                        {new Date(article.date).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={articles.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
   <div style={{marginBottom: "20px"}}></div>
    </>
  );
};

export default LastFiveArticles;
