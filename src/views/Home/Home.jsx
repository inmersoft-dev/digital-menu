import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

// @emotion
import { css } from "@emotion/css";

// @mui icons
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

// @mui typography
import { IconButton, Typography, TextField } from "@mui/material";

// own components
import Container from "../../components/Container/Container";

// contexts
import { useLanguage } from "../../context/LanguageProvider";

const Home = () => {
  const { register, handleSubmit } = useForm();
  const { languageState } = useLanguage();

  const [notes, setNotes] = useState([
    { title: "To do", content: "Content..." },
  ]); // useReducer(notesReducer, []);

  const inputSx = [{ width: "100%" }, { marginTop: "20px", width: "100%" }];

  const handleForm = (d) => {
    const { title, content } = d;
    console.log(title, content);
    notes.push({ type: "add", title, content });
  };

  const formCss = css({
    width: "100%",
  });

  const onEdit = (e) => {
    const { id } = e.target;
    const parsedId = id.split("-");
    const numberId = Number(parsedId[1]);
  };

  const onDelete = (e) => {
    const { id } = e.target;
    const parsedId = id.split("-");
    const numberId = Number(parsedId[1]);
    notes.splice(numberId, 1);
  };

  useEffect(() => {
    console.log("hola");
  }, [notes]);

  return (
    <Container flexDirection="column" sx={{ width: "80%", maxWidth: "400px" }}>
      <form className={formCss} onSubmit={handleSubmit(handleForm)}>
        {languageState.texts.Inputs.map((item, i) => (
          <Container
            key={item.id}
            sx={{ position: i === 0 ? "relative" : undefined }}
          >
            <TextField
              label={item.label}
              id={item.id}
              type={item.type}
              multiline={item.multiline}
              minRows={item.minRows}
              maxRows={item.maxRows}
              placeholder={item.placeholder}
              sx={inputSx[i]}
              {...register(item.id)}
              required
            />
            {i === 0 && (
              <IconButton
                type="submit"
                color="primary"
                sx={{
                  position: "absolute",
                  transform: "translateY(-50%)",
                  top: "50%",
                  right: "0px",
                }}
              >
                <AddCircleIcon />
              </IconButton>
            )}
          </Container>
        ))}
      </form>
      <Container>
        {notes.map((item, i) => (
          <Container key={i}>
            <Typography variant="h5">{item.title}</Typography>
            <IconButton onClick={onEdit} id={`edit-${i}`}>
              <EditIcon id={`svgEdit-${i}`} />
            </IconButton>
            <IconButton onClick={onDelete} id={`delete-${i}`}>
              <DeleteIcon id={`svgDelete-${i}`} />
            </IconButton>
            <Typography variant="body1">{item.content}</Typography>
          </Container>
        ))}
      </Container>
    </Container>
  );
};

export default Home;
