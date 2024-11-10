import styled from "styled-components";
import React, { useState } from 'react';
import axios from 'axios';

const Wrapper = styled.section`
  padding: 6rem 0 4rem 0;
  text-align: center;
  color: #333;
  font-family: "Arial", sans-serif;

  iframe {
    margin-top: 3rem;
    border-radius: 12px;
    box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.1);
  }

  .common-heading {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    color: #045215;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .container {
    margin-top: 3rem;
    position: relative;

    .contact-form {
      max-width: 30rem;
      margin: auto;
      background-color: #f9fbfd;
      padding: 1.5rem 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      transition: box-shadow 0.3s ease;

      &:hover {
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      }

      .contact-inputs {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        .input-container {
          position: relative;
          margin-top: 1rem;

          input,
          textarea {
            width: 100%;
            padding: 0.6rem 0.8rem;
            border-radius: 6px;
            border: 1px solid #ccc;
            font-size: 0.9rem;
            outline: none;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
            background-color: #fff;

            &:focus {
              border-color: #045215;
              box-shadow: 0 0 8px rgba(4, 82, 21, 0.1);
            }

            &:focus + label,
            &:not(:placeholder-shown) + label {
              transform: translateY(-2rem) scale(0.85);
              font-size: 0.75rem;
              color: #045215;
            }
          }

          textarea {
            resize: vertical;
            padding-bottom: 0.5rem;
          }

          label {
            position: absolute;
            left: 0.8rem;
            top: 1rem;
            color: #666;
            font-size: 0.85rem;
            pointer-events: none;
            transition: all 0.2s ease;
            transform-origin: left;
          }
        }

        input[type="submit"] {
          cursor: pointer;
          background: #045215;
          color: white;
          border: none;
          padding: 0.8rem;
          border-radius: 6px;
          font-size: 0.95rem;
          font-weight: bold;
          transition: background 0.3s, transform 0.2s;
          box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.1);

          &:hover {
            background: #033b13;
            transform: scale(1.03);
          }

          &:active {
            transform: scale(1);
          }
        }
      }
    }
  }
`;

const Contact = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    message: "",
  });

  const [statusMessage, setStatusMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/users/contact",
        formData
      );
      if (response.data.success) {
        setStatusMessage("Message sent successfully!");
        setFormData({ username: "", email: "", message: "" });
      }
    } catch (error) {
      setStatusMessage("Error sending message. Please try again.");
    }
  };

  return (
    <Wrapper>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3690.0533101781584!2d70.79828297453473!3d22.351615841034885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959b5e73ac2056b%3A0xe67994f617cdd959!2sGokul%20Agro%20Seeds!5e0!3m2!1sen!2sin!4v1721894815431!5m2!1sen!2sin"
        referrerPolicy="no-referrer-when-downgrade"
        width="100%"
        height="400"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
      ></iframe>

      <div className="container">
        <h2 className="common-heading">Contact Us</h2>
        <div className="contact-form">
          <form onSubmit={handleSubmit} className="contact-inputs">
            <div className="input-container">
              <input
                type="text"
                name="username"
                placeholder=" "
                value={formData.username}
                onChange={handleInputChange}
                required
                autoComplete="off"
              />
              <label>Username</label>
            </div>

            <div className="input-container">
              <input
                type="email"
                name="email"
                placeholder=" "
                value={formData.email}
                onChange={handleInputChange}
                required
                autoComplete="off"
              />
              <label>Email</label>
            </div>

            <div className="input-container">
              <textarea
                name="message"
                cols="30"
                rows="5"
                required
                autoComplete="off"
                placeholder=" "
                value={formData.message}
                onChange={handleInputChange}
              ></textarea>
              <label>Enter your message</label>
            </div>

            <input type="submit" value="Send" />
          </form>
          {statusMessage && <p>{statusMessage}</p>}
        </div>
      </div>
    </Wrapper>
  );
};

export default Contact;
