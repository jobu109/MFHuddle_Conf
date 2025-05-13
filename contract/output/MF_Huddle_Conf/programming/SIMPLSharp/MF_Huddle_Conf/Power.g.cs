using System;
using System.Collections.Generic;
using System.Linq;
using Crestron.SimplSharpPro.DeviceSupport;
using Crestron.SimplSharpPro;

namespace MF_Huddle_Conf
{
    public interface IPower
    {
        object UserObject { get; set; }

        event EventHandler<UIEventArgs> on_btn;
        event EventHandler<UIEventArgs> off_btn;

        void on_fb(PowerBoolInputSigDelegate callback);
        void off_fb(PowerBoolInputSigDelegate callback);

    }

    public delegate void PowerBoolInputSigDelegate(BoolInputSig boolInputSig, IPower power);

    internal class Power : IPower, IDisposable
    {
        #region Standard CH5 Component members

        private ComponentMediator ComponentMediator { get; set; }

        public object UserObject { get; set; }

        public uint ControlJoinId { get; private set; }

        private IList<BasicTriListWithSmartObject> _devices;
        public IList<BasicTriListWithSmartObject> Devices { get { return _devices; } }

        #endregion

        #region Joins

        private static class Joins
        {
            internal static class Booleans
            {
                public const uint on_btn = 1;
                public const uint off_btn = 2;

                public const uint on_fb = 1;
                public const uint off_fb = 2;
            }
        }

        #endregion

        #region Construction and Initialization

        internal Power(ComponentMediator componentMediator, uint controlJoinId)
        {
            ComponentMediator = componentMediator;
            Initialize(controlJoinId);
        }

        private void Initialize(uint controlJoinId)
        {
            ControlJoinId = controlJoinId; 
 
            _devices = new List<BasicTriListWithSmartObject>(); 
 
            ComponentMediator.ConfigureBooleanEvent(controlJoinId, Joins.Booleans.on_btn, onon_btn);
            ComponentMediator.ConfigureBooleanEvent(controlJoinId, Joins.Booleans.off_btn, onoff_btn);

        }

        public void AddDevice(BasicTriListWithSmartObject device)
        {
            Devices.Add(device);
            ComponentMediator.HookSmartObjectEvents(device.SmartObjects[ControlJoinId]);
        }

        public void RemoveDevice(BasicTriListWithSmartObject device)
        {
            Devices.Remove(device);
            ComponentMediator.UnHookSmartObjectEvents(device.SmartObjects[ControlJoinId]);
        }

        #endregion

        #region CH5 Contract

        public event EventHandler<UIEventArgs> on_btn;
        private void onon_btn(SmartObjectEventArgs eventArgs)
        {
            EventHandler<UIEventArgs> handler = on_btn;
            if (handler != null)
                handler(this, UIEventArgs.CreateEventArgs(eventArgs));
        }

        public event EventHandler<UIEventArgs> off_btn;
        private void onoff_btn(SmartObjectEventArgs eventArgs)
        {
            EventHandler<UIEventArgs> handler = off_btn;
            if (handler != null)
                handler(this, UIEventArgs.CreateEventArgs(eventArgs));
        }


        public void on_fb(PowerBoolInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].BooleanInput[Joins.Booleans.on_fb], this);
            }
        }

        public void off_fb(PowerBoolInputSigDelegate callback)
        {
            for (int index = 0; index < Devices.Count; index++)
            {
                callback(Devices[index].SmartObjects[ControlJoinId].BooleanInput[Joins.Booleans.off_fb], this);
            }
        }

        #endregion

        #region Overrides

        public override int GetHashCode()
        {
            return (int)ControlJoinId;
        }

        public override string ToString()
        {
            return string.Format("Contract: {0} Component: {1} HashCode: {2} {3}", "Power", GetType().Name, GetHashCode(), UserObject != null ? "UserObject: " + UserObject : null);
        }

        #endregion

        #region IDisposable

        public bool IsDisposed { get; set; }

        public void Dispose()
        {
            if (IsDisposed)
                return;

            IsDisposed = true;

            on_btn = null;
            off_btn = null;
        }

        #endregion

    }
}
