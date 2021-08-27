import React from "react";
import "./App.css";
import Input from "./components/Input";
import api from "./services/api.js";

function App() {
  // Are we updating?
  const [id2Edit, setId2Edit] = React.useState(null);

  // This is used to control the child component
  const [agent, setAgent] = React.useState({});

  // Array destructuring
  const [agents, setAgents] = React.useState([]);
  const [errors, setErrors] = React.useState([]);

  React.useEffect(
    () => {
      api
        .index()
        .then((agents) => {
          setAgents(agents);
        })
        .catch(() => {
          console.error("Some other error when fetching all the stuff");
        });
    },

    // Dependency array
    // Empty means only run this `useEffect` once
    []
  );

  const handleFormChange = (event) => {
    // We update our agent as we type
    // When we submit, we send over agent state as the payload
    // We reset it, thereby clearing all fields at once! :)
    setAgent((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleClick = ({ target }) => {
    const agentId = Number(target.dataset.agentId);

    // Get the button text - which button was clicked?
    switch (target.innerText.toLowerCase()) {
      case "update":
        // We get the id from our data attribute in the button
        // We update state with this id
        // This will be checked when we submit so we can update, if necessary
        setId2Edit(agentId);

        // How do we find the correct text to use?
        setAgent(agents.find((agent) => agent.agentId === agentId));

        break;
      case "delete":
        api
          .delete(agentId)
          .then(() => {
            setAgents((prevAgents) =>
              prevAgents.filter((agent) => agent.agentId !== agentId)
            );
          })
          .catch((err) => {
            console.error("Some other error.", err);
          });

        break;
      default:
        throw new Error("Invalid! Check your button text!");
    }
  };

  const handleSubmit = (e) => {
    // Do not refresh page when form is submitted
    e.preventDefault();

    const form = e.target;
    const agentValue = form.elements[0].value.trim();

    if (agentValue) {
      // Check if this is an edit or a new agent
      if (id2Edit) {
        // We are updating
        api
          .update(agent)
          .then(() => {
            console.log(agent);
            setAgents((prevAgents) =>
              prevAgents.map((existingAgent) => {
                console.log(id2Edit);
                if (existingAgent.agentId === id2Edit) {
                  // Avoid mutating the original agent object
                  // We create a new object by spreading out the original (...agent)
                  // We compose the new object with the updated properties
                  // `inputValue` is piece of state

                  return agent;
                }

                return existingAgent;
              })
            );
            // ⚠️ Don't get stuck in edit mode!
            setId2Edit(null);
            // Clear the input
            setAgent("");
          })
          .catch((err) => {
            console.error("Some other error.", err);
          });
      }
      // CREATE!
      else {
        api
          .create(agent)
          .then((response) =>
            setAgents((prevAgents) => [...prevAgents, response])
          )
          .catch((errors) => setErrors(errors));

        setAgent({});
      }
    }
  };

  return (
    // Fragment tag
    <>
      <form onSubmit={handleSubmit} className="p-4">
        {/* Input gets re-rendered whenever inputValue changes. */}
        <Input
          value={agent.firstName}
          changeHandler={handleFormChange}
          name="firstName"
          label="First Name"
        />

        <Input
          value={agent.middleName}
          changeHandler={handleFormChange}
          name="middleName"
          label="Middle Name"
        />

        <Input
          value={agent.lastName}
          changeHandler={handleFormChange}
          name="lastName"
          label="Last Name"
        />

        <Input
          value={agent.dob}
          changeHandler={handleFormChange}
          name="dob"
          label="Date of Birth"
        />

        <Input
          value={agent.heightInInches}
          changeHandler={handleFormChange}
          name="heightInInches"
          label="Height In Inches"
        />

        {errors.map((error) => (
          <p key={error}>{error}</p>
        ))}

        <button
          type="submit"
          className="bg-green-500 ml-1 p-4 rounded-sm text-white my-2"
        >
          {id2Edit ? "Update" : "Add"} Agent
        </button>
      </form>

      <ol className="p-4">
        {agents.map(({ agentId, firstName, lastName }) => (
          // TODO: Move this to a new component
          <li key={agentId} className="my-2">
            {agentId} {firstName} {lastName}
            <button
              className="bg-yellow-500 ml-1 rounded-xl p-2"
              onClick={handleClick}
              data-agent-id={agentId}
            >
              Update
            </button>
            <button
              className="bg-red-500 ml-1 rounded-xl text-white p-2"
              onClick={handleClick}
              data-agent-id={agentId}
            >
              Delete
            </button>
          </li>
        ))}
      </ol>
    </>
  );
}

export default App;
