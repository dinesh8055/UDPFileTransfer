import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.io.Serializable;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.util.HashMap;

public class GameServer {
	public static void main(String[] args) throws UnknownHostException {
		InetAddress localhost = InetAddress.getByName("127.0.0.1");
		InetSocketAddress customer = new InetSocketAddress(localhost, 20000);
		sendPacket(customer);
	}

	public static void sendPacket(InetSocketAddress address) {
		DatagramSocket serverSocket = null;
		try {
			Thread.sleep(2000); // 1000 milliseconds is one second.
		} catch (InterruptedException ex) {
			Thread.currentThread().interrupt();
		}
		try {
			serverSocket = new DatagramSocket();
		} catch (SocketException e) {
			e.printStackTrace();
		}
		try {
			File gameFile=new File("game.txt");
			byte[] fileData = new byte[(int)gameFile.length()/100];
			ByteArrayOutputStream messageRaw = new ByteArrayOutputStream(5000);
			ObjectOutputStream os = new ObjectOutputStream(
					new BufferedOutputStream(messageRaw));
			FileInputStream fos = new FileInputStream(new File("game.txt"));
			for (int i = 0; i < (int)gameFile.length()/100; i++) {
				fileData[i] = (byte) fos.read();
			}
			os.flush();
			os.writeObject(new Message(fileData, (int)gameFile.length()/100,1024));
			os.flush();
			byte[] messageBytes = messageRaw.toByteArray();
			// retrieves byte array
			DatagramPacket packet = new DatagramPacket(messageBytes, messageBytes.length,
					address.getAddress(), address.getPort());

			serverSocket.send(packet);
			fos.close();
			System.out.println((int)gameFile.length()/100);
		} catch (IOException e) {
			e.printStackTrace();
		}
		serverSocket.close();
	}
}

class Message implements Serializable {
	byte[] fileData;
	int sequence;
	int length;

	Message(byte[] fileData, int length,int sequence) {
		this.fileData = fileData;
		this.sequence = sequence;
		this.length=length;
	}
}
