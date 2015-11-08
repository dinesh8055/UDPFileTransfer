import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.Serializable;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.util.HashMap;
import java.io.BufferedOutputStream;


public class GameClient {
	public static void main(String[] args) throws UnknownHostException, SocketException, ClassNotFoundException {
		InetAddress localhost = InetAddress.getByName("127.0.0.1");
		InetSocketAddress customer = new InetSocketAddress(localhost, 20000);
		recievePacket(customer);
	}

	public static void recievePacket(InetSocketAddress customer) throws SocketException, ClassNotFoundException {
		DatagramSocket socket = new DatagramSocket((20000));
		try {
			byte[] recvBuf = new byte[65535];
			DatagramPacket packet = new DatagramPacket(recvBuf, recvBuf.length);
			socket.receive(packet);
			ByteArrayInputStream byteStream = new ByteArrayInputStream(recvBuf);
			ObjectInputStream is = new ObjectInputStream(
					new BufferedInputStream(byteStream));
			Message message = (Message) is.readObject();
			int sequence = message.sequence;
			byte[] fileData=message.fileData;
			FileOutputStream fos = new FileOutputStream(new File("game.txt"));
			BufferedOutputStream bos = new BufferedOutputStream(fos);
			System.out.println(message.length);
			bos.write(fileData, 0 , message.length);
			fos.close();
			bos.close();
		} catch (IOException e) {
			System.err.println("Exception:  " + e);
			e.printStackTrace();
		}
		// }

		socket.close();
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

