import styled from 'styled-components';

const Wrapper = styled.section`
  padding: 9rem 0 5rem 0;
  text-align: center;
  color: #333;
  font-family: 'Arial', sans-serif;

  iframe {
    margin-top: 5rem;
  }

  .common-heading {
    font-size: 3rem;
    margin-bottom: 2rem;
    color: green; /* Changed to green */
    text-transform: uppercase;
    letter-spacing: 0.1em;
    background: none; /* Removed gradient background */
    -webkit-background-clip: text;
    -webkit-text-fill-color: inherit; /* Removed transparent fill */
  }

  .container {
    margin-top: 4rem;
    position: relative; /* Add position relative to container */

    .contact-form {
      max-width: 40rem;
      margin: auto;
      background-color: #fff;
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      transition: box-shadow 0.3s ease; /* Removed transform transition */
      /* Added a fixed height to prevent movement from transform */

      &:hover {
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
      }

      .contact-inputs {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        .input-container {
          position: relative;
          margin-top: 1rem;

          input,
          textarea {
            width: 100%;
            padding: 0.8rem;
            border-radius: 8px;
            border: 1px solid #ccc;
            font-size: 0.9rem;
            outline: none;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;

            &:focus {
              border-color: #007bff;
              box-shadow: 0 0 10px rgba(0, 123, 255, 0.1);
            }

            &:focus + label,
            &:not(:placeholder-shown) + label {
              transform: translateY(-2.5rem);
              font-size: 0.75rem;
              color: #007bff;
            }

            &:focus + label {
              color: #007bff;
            }
          }

          textarea {
            resize: vertical;
            padding-bottom: 0.3rem;
          }

          label {
            position: absolute;
            left: 1rem;
            top: 1.2rem;
            color: #666;
            font-size: 0.9rem;
            pointer-events: none;
            transition: all 0.2s ease;
            transform-origin: left;
            transform: translateY(0);
          }
        }

        input[type="submit"] {
          cursor: pointer;
          background: green; /* Changed to green */
          color: white;
          border: none;
          padding: 0.8rem;
          border-radius: 8px;
          font-size: 1rem;
          transition: background 0.3s, transform 0.2s;

          &:hover {
            background: darkgreen; /* Changed to a darker green on hover */
            transform: scale(1.05);
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
          <form
            action="https://formspree.io/f/xeqdgwnq"
            method="POST"
            className="contact-inputs"
          >
            <div className="input-container">
              <input
                type="text"
                name="username"
                placeholder=" "
                required
                autoComplete="off"
              />
              <label>Username</label>
            </div>

            <div className="input-container">
              <input
                type="email"
                name="Email"
                placeholder=" "
                required
                autoComplete="off"
              />
              <label>Email</label>
            </div>

            <div className="input-container">
              <textarea
                name="Message"
                cols="30"
                rows="5"
                required
                autoComplete="off"
                placeholder=" "
              ></textarea>
              <label>Enter your message</label>
            </div>

            <input type="submit" value="Send" />
          </form>
        </div>
      </div>
    </Wrapper>
  );
};

export default Contact;
