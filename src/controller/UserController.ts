import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { User } from "../entity/User";
import * as bcrypt from "bcrypt";
import * as nodemailer from "nodemailer";
import * as crypto from "crypto";

export const saveUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 8);
    const user = await getRepository(User).save({
      name,
      email,
      password: passwordHash,
    });

    return res.status(201).json(user);
  } catch (error) {
    return res.status(422).json({ message: "Error in entities" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await getRepository(User).find({
      where: {
        email,
      },
    });

    if (await bcrypt.compare(password, user[0].password)) {
      const data = {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
      };

      return res.status(201).json(data);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(404).json({ message: "User not found" });
  }
};

export const forgetPassword = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await getRepository(User).find({
      where: {
        email,
      },
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "",
        pass: "",
      },
    });

    const newPassword = crypto.randomBytes(4).toString("HEX");

    transporter
      .sendMail({
        from: "Administrador <>",
        to: email,
        subject: "Recuperação de senha!",
        html: `<p>Olá, sua nova senha para acesar o sistema é: ${newPassword}</p></br><a href="http://localhost:3333/login">Sistema</a>`,
      })
      .then(() => {
        bcrypt.hash(newPassword, 8).then((password) => {
          getRepository(User)
            .update(user[0].id, {
              password: password,
            })
            .then(() => {
              return res.status(200).json({ message: "Email sended" });
            })
            .catch(() => {
              return res.status(404).json({ message: "User not found" });
            });
        });
      })
      .catch((error) => {
        return res.status(404).json({ message: "Fail to send mail" });
      });
  } catch (error) {
    return res.status(404).json({ message: "User not found" });
  }
};
